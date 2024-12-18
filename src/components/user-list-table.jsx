import { Avatar, Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";

export const UserListTable = ({ listUsers = [], handleDisableEnableUser }) => {
    return (
        <Table isStriped aria-label="Example static collection table" radius="sm">
            <TableHeader radius="sm">
                <TableColumn>
                    <span className="flex items-center cursor-pointer" aria-label="id">
                        ID
                    </span>
                </TableColumn>
                <TableColumn>
                    <span className="flex items-center cursor-pointer" aria-label="name">
                        Username
                    </span>
                </TableColumn>
                <TableColumn>Avatar</TableColumn>
                <TableColumn>
                    <span className="flex items-center cursor-pointer" aria-label="owner">
                        Full name
                    </span>
                </TableColumn>
                <TableColumn>Role</TableColumn>
                <TableColumn>
                    <span className="flex items-center cursor-pointer" aria-label="createdAt">
                        Created at
                    </span>
                </TableColumn>
                <TableColumn>
                    <span className="flex items-center cursor-pointer">Spent($)</span>
                </TableColumn>
                <TableColumn>Owned courses</TableColumn>
                <TableColumn>Number enrollment</TableColumn>
                <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
                {listUsers?.map((user) => {
                    const createdAt = new Date(user?.["created at"]);
                    return (
                        <TableRow key={user?.["user id"]}>
                            <TableCell>{user?.["user id"]}</TableCell>
                            <TableCell>{user?.["username"]}</TableCell>
                            <TableCell>
                                <Avatar src={user?.["avatar image"]} />
                            </TableCell>
                            <TableCell>
                                {user?.["first name"]}&nbsp;{user?.["last name"]}
                            </TableCell>
                            <TableCell>{user?.["role name"]}</TableCell>
                            <TableCell>
                                {createdAt.getDate()} - {createdAt.getMonth() + 1} - {createdAt.getFullYear()}
                            </TableCell>
                            <TableCell>{user?.["spent"]}</TableCell>
                            <TableCell>{user?.["number created course"]}</TableCell>
                            <TableCell>{user?.["number enrollment"]}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Button size="sm" radius="sm" color="primary">
                                        View
                                    </Button>
                                    <Button
                                        size="sm"
                                        radius="sm"
                                        color={user?.["disabled"] ? "success" : "danger"}
                                        onPress={() =>
                                            handleDisableEnableUser(
                                                user?.["disabled"] ? "enable" : "disable",
                                                user?.["user id"]
                                            )
                                        }>
                                        {user?.["disabled"] ? "Enable" : "Disable"}
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};
