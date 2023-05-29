console.log('ranning auth.js')
//AUTH.js
var loginFunc = function () {
  console.log('ran here')
  chrome.runtime.sendMessage({ command: 'loginUser' }, (response) => {
    document.querySelector('.loading').style.display = 'none'
    if (chrome.runtime.lastError) {
      // Something went wrong
      console.warn('Whoops.. ' + chrome.runtime.lastError.message)
    }
    console.log(response)
    document.querySelector('.loginArea').style.display = 'none'
    document.querySelector('.loggedInArea').style.display = 'none'
    if (response.status == 'success') {
      document.querySelector('.loggedInArea').style.display = 'block'
      document.querySelector('.loggedInArea span').innerHTML =
        response?.message?.id || response.firebaseUser.uid
    } else {
      //add Errors
      document.querySelector('.loginArea').style.display = 'block'
    }
  })
}

console.log(document.querySelector('.login-btn-auth'))

document.querySelector('.login-btn-auth').addEventListener('click', function () {
  console.log('ran here 2')
  document.querySelector('.loading').style.display = 'block'
  loginFunc()
})
