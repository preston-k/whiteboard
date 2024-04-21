let staticbox = document.getElementById('static')
let staticinfo = ''
const urlParams = new URLSearchParams(window.location.search)
let boardId = urlParams.get('id')
let name = urlParams.get('name')
let userid = urlParams.get('userid')
let jc = urlParams.get('jc')
staticinfo = 'Board ID: ' + boardId + ' || Join Code: ' + jc // + ' || Username: ' + name + ' || User ID: ' + userid
if (userid == null) {
  staticinfo += ' || You have joined as a host.'
  document.querySelector('#joincode').style.display = 'inline'
  document.querySelector('#joincode').innerHTML = 'Join Code: '+jc+' || '
  document.querySelector('#usercount').style.display = 'inline'
} else {
  staticinfo += ' || You have joined as a participant.'
}
staticbox.innerHTML = staticinfo
console.log('bId:'+boardId+'jc:' + jc + 'u:' + name + 'uid:'+userid)

if (userid == null || userid == '') {
  // alert('Your board has been created! To join this board, go to whiteboard.prestonkwei.com and type in joincode: '+ jc)
  document.querySelector('#createNew').style.display = 'none'
  document.querySelector('#edit').style.display = 'none'
  // document.querySelector('#joinaspart').style.display = 'none'
}