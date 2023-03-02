export default class Controller {
    #view
    #service
    #worker
    #blinkCounter = 0
    constructor({ view, service, worker }) {
        this.#view = view
        this.#service = service
        this.#worker = this.#configureWorker(worker)

        this.#view.configureOnBtnClick(this.onBtnStart.bind(this))
    }

    static async initialize(deps) {
        const controller = new Controller(deps)
        controller.log('not yet detecting eye blink! click in the button to start')
        return controller.init()
    }

    #configureWorker(worker) {
        let ready = false
        worker.onmessage = ({ data }) => {
            if('READY' === data)  {
                console.log('worker is ready!')
                this.#view.enableButton()
                ready = true
                return
            }
            const blinked = data.blinked
            this.#blinkCounter += blinked
            console.log('blinked', blinked)
        }

        return worker
    }

    async init() {
        console.log('init!!')
    }

    log(text) {
        this.#view.log(`logger: ${text}`)
    }

    onBtnStart() {
        this.log('initializing detection...')
        this.#blinkCounter = 0
    }
}