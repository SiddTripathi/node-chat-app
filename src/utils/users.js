const users = []

//addUser -> track new user, removeUser -->stop tracking, getUser->fetch user, getuserInRoom

const addUser = ({ id, username, room }) => {
    //cleaning the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validating the data
    if (!username || !room) {
        return {
            error: 'Username and Room are required!!'
        }
    }
    //check if user already exists
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate username
    if (existingUser) {
        return {
            error: 'Username is already in use!. Use different Username'
        }
    }

    //store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}