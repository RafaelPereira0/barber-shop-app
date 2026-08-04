export function emitLogout(){
    window.dispatchEvent(new Event('logout'))
}