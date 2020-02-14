const socket = io()

//Elements reusable

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $location = document.querySelector('#location')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//chat optns
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

// socket.on('Welcome', (msg) => {
//     console.log(msg)
//     const html = Mustache.render(messageTemplate, {
//         message: msg
//     })
//     $messages.insertAdjacentHTML('beforeend', html)
// })

const autoscroll = () => {
    //New Message element
    const $newMessage = $messages.lastElementChild

    //height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight = $messages.offsetHeight

    //Height of Container of messages
    const containerHeight = $messages.scrollHeight

    //How much we have scrolled up or down
    const scrollOffset = $messages.scrollTop + visibleHeight

    //using Math.round to handle the decimal values of scrollOffset
    if (Math.round(containerHeight - newMessageHeight - 1) <= Math.round(scrollOffset)) {
        $messages.scrollTop = $messages.scrollHeight
    }


}

socket.on('message', (msg) => {
    console.log(msg)
    const html = Mustache.render(messageTemplate, {
        username: msg.username,
        message: msg.text,
        createdAt: moment(msg.createdAt).format('hh:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (locmsg) => {
    console.log(locmsg)
    const html = Mustache.render(locationTemplate, {
        username: locmsg.username,
        location: locmsg.url,
        createdAt: moment(locmsg.createdAt).format('hh:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = document.querySelector('input').value
    socket.emit('sendMessage', message, (error) => {
        //disable button for a moment, after message is sent and clear the input box
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            return console.log(error)
        }

        console.log('Message delivered')
    })


})




$sendLocationButton.addEventListener('click', () => {

    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by browser')
    }
    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {

        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared to all')

        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})