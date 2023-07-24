export default () => {

    const preloader = document.getElementById('preloader')
        if(preloader && preloader.parentElement) {
            preloader.parentElement.removeChild(preloader)
            preloader.remove()
        }
}