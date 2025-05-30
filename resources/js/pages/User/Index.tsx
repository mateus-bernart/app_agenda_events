import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Megaphone, Search } from 'lucide-react';
import { useState } from 'react';
import { User, UserFormData } from './user-types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Users Management',
        href: '/users',
    },
];

type PageProps = {
    flash: {
        message?: string;
    };
    users: User[];
};

export default function Index() {
    const { flash, users } = usePage<PageProps>().props;
    const { delete: destroy, processing } = useForm();
    const [query, setQuery] = useState<string>('');
    const [openModal, setOpenModal] = useState(false);

    const { data, setData, put } = useForm<UserFormData>({
        user_id: null,
        name: '',
        email: '',
        user_type: 'user',
    });

    const handleDeleteUser = (eventId: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            destroy(route('users.destroy', eventId));
        }
    };

    const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setData('user_type', data.user_type);
        if (data.user_id !== null) {
            put(route('users.updateUserType', data.user_id));
        }
    };

    const filteredUsers = users.filter((user) => {
        return user.name.toLowerCase().includes(query.toLowerCase());
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {flash.message && (
                <Alert className="mx-4 mt-4 max-w-70 bg-green-100">
                    <Megaphone className="h-4 w-4" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>{flash.message}</AlertDescription>
                </Alert>
            )}
            <div className="m-4 flex w-1/2 items-center gap-2">
                <Search />
                <Input
                    placeholder="Search user"
                    className=""
                    onChange={(e) => {
                        setQuery(e.target.value);
                    }}
                ></Input>
            </div>

            {filteredUsers.length > 0 ? (
                <div className="mx-4 mb-4 flex flex-wrap gap-4">
                    <Table>
                        <TableCaption>A list of your users.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.user_type}</TableCell>
                                    <TableCell className="flex gap-2">
                                        <Button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="bg-red-500 hover:bg-red-700"
                                            disabled={processing}
                                        >
                                            Delete
                                        </Button>
                                        <Dialog open={openModal} onOpenChange={setOpenModal}>
                                            <DialogTrigger asChild>
                                                <span className="flex items-center gap-2">
                                                    <Button
                                                        onClick={() => {
                                                            setData('user_id', user.id);
                                                        }}
                                                        className="bg-blue-500 hover:bg-blue-700"
                                                        disabled={processing}
                                                    >
                                                        Edit
                                                    </Button>
                                                </span>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <form onSubmit={handleUpdateUser}>
                                                    <DialogHeader>
                                                        <DialogTitle>Manage Approvement</DialogTitle>
                                                        <DialogDescription></DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="status" className="text-right">
                                                                Status
                                                            </Label>
                                                            <Select
                                                                onValueChange={(value) => setData('user_type', value)}
                                                                defaultValue={data.user_type}
                                                            >
                                                                <SelectTrigger id="status" className="col-span-3 cursor-pointer">
                                                                    <SelectValue placeholder="Select a status" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="admin" className="cursor-pointer hover:bg-gray-100">
                                                                        Admin
                                                                    </SelectItem>
                                                                    <SelectItem value="user" className="cursor-pointer hover:bg-gray-100">
                                                                        User
                                                                    </SelectItem>
                                                                    <SelectItem value="guest" className="cursor-pointer hover:bg-gray-100">
                                                                        Guest
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button
                                                            type="submit"
                                                            className="cursor-pointer"
                                                            disabled={processing}
                                                            onClick={() => setOpenModal(false)}
                                                        >
                                                            Save changes
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <span className="mx-4">No users found</span>
            )}
        </AppLayout>
    );
}
