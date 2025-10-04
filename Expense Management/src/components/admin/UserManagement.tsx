import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, Edit, UserCheck, UserX } from 'lucide-react';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import ConfirmationDialog from './ConfirmationDialog';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'manager' | 'admin';
  manager?: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

const mockUsers: User[] = [
    { id: '1', name: 'John Employee', email: 'john.employee@company.com', role: 'employee', manager: 'Jane Manager', status: 'active', joinDate: '2024-01-15' },
    { id: '2', name: 'Jane Manager', email: 'jane.manager@company.com', role: 'manager', status: 'active', joinDate: '2024-01-10' },
    { id: '3', name: 'Bob Admin', email: 'bob.admin@company.com', role: 'admin', status: 'active', joinDate: '2024-01-01' },
    { id: '4', name: 'Sarah Developer', email: 'sarah.dev@company.com', role: 'employee', manager: 'Jane Manager', status: 'active', joinDate: '2024-01-20' },
    { id: '5', name: 'Mike Designer', email: 'mike.design@company.com', role: 'employee', manager: 'Jane Manager', status: 'inactive', joinDate: '2024-01-18' }
];

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'admin':
      return <Badge variant="destructive">Admin</Badge>;
    case 'manager':
      return <Badge variant="default">Manager</Badge>;
    case 'employee':
      return <Badge variant="secondary">Employee</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
    case 'inactive':
      return <Badge variant="secondary" className="bg-red-100 text-red-800">Inactive</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function UserManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deactivatingUser, setDeactivatingUser] = useState<User | null>(null);

  const handleAddUser = (userData: {
    fullName: string;
    email: string;
    role: 'employee' | 'manager' | 'admin';
    managerId?: string;
    country: string;
  }) => {
    const manager = users.find(u => u.id === userData.managerId);
    const user: User = {
      id: `user_${Date.now()}`,
      name: userData.fullName,
      email: userData.email,
      role: userData.role,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      manager: manager?.name,
    };
    setUsers([...users, user]);
    toast.success(`${user.name} has been added successfully.`);
  };

  const handleEditUser = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    setEditingUser(null);
    toast.success(`${updatedUser.name}'s details have been updated.`);
  };

  const confirmDeactivateUser = () => {
    if (!deactivatingUser) return;

    const newStatus = deactivatingUser.status === 'active' ? 'inactive' : 'active';
    setUsers(users.map(user =>
      user.id === deactivatingUser.id
        ? { ...user, status: newStatus }
        : user
    ));
    toast.info(`${deactivatingUser.name} has been set to ${newStatus}.`);
    setDeactivatingUser(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">User Management</h2>
          <p className="text-muted-foreground">Manage employees, managers, and their relationships</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}><Plus className="h-4 w-4 mr-2" />Add User</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>All Users ({users.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{user.manager || '—'}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}><Edit className="h-3 w-3 mr-1" />Edit</Button>
                      <Button variant="outline" size="sm" onClick={() => setDeactivatingUser(user)}>
                        {user.status === 'active' 
                          ? <><UserX className="h-3 w-3 mr-1 text-red-500"/>Deactivate</>
                          : <><UserCheck className="h-3 w-3 mr-1 text-green-500"/>Activate</>
                        }
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddUserModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAddUser={handleAddUser} existingUsers={users} />
      
      {editingUser && (
        <EditUserModal isOpen={!!editingUser} onClose={() => setEditingUser(null)} onEditUser={handleEditUser} user={editingUser} existingUsers={users} />
      )}
      
      {deactivatingUser && (
        <ConfirmationDialog
          isOpen={!!deactivatingUser}
          onClose={() => setDeactivatingUser(null)}
          onConfirm={confirmDeactivateUser}
          title={`Confirm ${deactivatingUser.status === 'active' ? 'Deactivation' : 'Activation'}`}
          description={`Are you sure you want to ${deactivatingUser.status === 'active' ? 'deactivate' : 'activate'} ${deactivatingUser.name}?`}
        />
      )}
    </div>
  );
}