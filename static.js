let staticbox = document.getElementById('static')
let staticinfo = ''
const urlParams = new URLSearchParams(window.location.search)
let boardId = urlParams.get('id')
let jc = urlParams.get('jc')
staticinfo = 'Board ID: ' + boardId + ' || Join Code: ' + jc
staticbox.innerHTML = staticinfo