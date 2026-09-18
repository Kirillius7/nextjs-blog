import container from 'Server/DI/container';

export default container
    .resolve("userController")
    .handler("/api/users/:userid")
    //.handler("/api/users/[userid]")
    //.handler()