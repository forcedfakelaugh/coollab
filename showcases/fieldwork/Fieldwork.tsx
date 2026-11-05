import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

/**
 * FIELDWORK / an interactive study of form.
 * Built using the Design on the Flank workflow:
 * https://github.com/Chien1618/design-on-the-flank
 * External runtime dependency: https://esm.sh/three@0.180.0
 * No model, image, HDR, or font assets are required.
 */

type Study = "orbit" | "helix" | "bloom"
type Finish = "chrome" | "copper" | "ink"
type Props = {
    studioName?: string
    firstWord?: string
    secondWord?: string
    introduction?: string
    background?: string
    ink?: string
    accent?: string
    initialStudy?: Study
    finish?: Finish
    speed?: number
    autoRotate?: boolean
    showSettings?: boolean
    style?: React.CSSProperties
}

const studies: { id: Study; name: string; note: string; description: string }[] = [
    { id: "orbit", name: "Orbit", note: "Balance in repetition", description: "Eleven ribbons. One shared center. A quiet negotiation between order and possibility." },
    { id: "helix", name: "Helix", note: "A rhythm unfolding", description: "The circle opens into a rhythm. Familiar parts find an entirely different way to belong." },
    { id: "bloom", name: "Bloom", note: "An exercise in openness", description: "A small shift becomes an opening. Repetition gives way to something almost organic." },
]

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h16m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.5" /></svg>
}

function StudyDrawing({ study, className = "" }: { study: Study; className?: string }) {
    return <svg className={className} viewBox="0 0 96 72" fill="none" aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => study === "orbit"
            ? <ellipse key={i} cx="48" cy="36" rx={11 + i * 3.5} ry="25" transform={`rotate(${i * 11 - 33} 48 36)`} />
            : study === "helix"
                ? <ellipse key={i} cx={46 + Math.sin(i * .65) * 4} cy={18 + i * 6} rx="25" ry="8" />
                : <ellipse key={i} cx="48" cy="26" rx="12" ry="21" transform={`rotate(${i * 360 / 7} 48 36)`} />)}
    </svg>
}

const css = `
.fw-root{--fw-line:color-mix(in srgb,var(--fw-ink) 19%,transparent);--fw-muted:color-mix(in srgb,var(--fw-ink) 66%,var(--fw-bg));position:relative;isolation:isolate;container-type:inline-size;width:100%;min-height:100%;background:var(--fw-bg);color:var(--fw-ink);font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;overflow:hidden}
.fw-root *{box-sizing:border-box}.fw-root button,.fw-root input{font:inherit}.fw-root button{color:inherit;cursor:pointer}.fw-root button:disabled{cursor:default;opacity:.45}.fw-root button:focus-visible,.fw-root [tabindex]:focus-visible,.fw-root input:focus-visible{outline:2px solid var(--fw-accent);outline-offset:6px}.fw-root button{border:0;background:none}.fw-root svg{flex-shrink:0}.fw-shell{max-width:1800px;margin:auto;padding:0 3.4cqw}.fw-mono{font-family:"SFMono-Regular",Consolas,"Liberation Mono",monospace;font-size:10px;line-height:1.55;letter-spacing:.075em;text-transform:uppercase}.fw-header{height:95px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--fw-line);position:relative;z-index:4;gap:24px}.fw-brand{font-size:26px;font-weight:700;letter-spacing:-1.4px;display:flex;gap:9px;align-items:center}.fw-brandmark{width:24px;height:24px;display:inline-block;position:relative}.fw-brandmark:before,.fw-brandmark:after{content:"";position:absolute;inset:3px;border:1.5px solid currentColor;border-radius:50%;transform:rotate(-36deg) scaleX(.48)}.fw-brandmark:after{transform:rotate(36deg) scaleX(.48)}.fw-header-center{display:flex;align-items:center;gap:10px;margin-left:-52px}.fw-dot{height:5px;width:5px;border-radius:50%;background:var(--fw-accent);display:inline-block;flex-shrink:0}.fw-about-button{display:flex;align-items:center;gap:26px;padding:10px 0!important;font-size:12px!important}.fw-about-button svg{width:16px}.fw-hero{position:relative;min-height:650px;height:min(690px,53cqw)}.fw-editorial{position:relative;z-index:2;width:45%;padding-top:52px;pointer-events:none}.fw-kicker{display:flex;align-items:center;gap:16px;color:var(--fw-muted)}.fw-kicker:before{content:"";display:block;width:24px;height:1px;background:var(--fw-accent)}.fw-title{font-size:clamp(80px,11.65cqw,184px);letter-spacing:-.09em;font-weight:500;line-height:.87;margin:37px 0 0 -8px;text-transform:uppercase}.fw-title span{display:block}.fw-title .fw-title-second{font-weight:400;margin-left:9cqw;letter-spacing:-.085em}.fw-title sup{font-size:16px;letter-spacing:-1px;position:relative;top:-.8em;margin-left:10px;vertical-align:top}.fw-subtitle{font-family:Georgia,"Times New Roman",serif;font-size:clamp(25px,2.6cqw,38px);font-style:italic;letter-spacing:-1.3px;font-weight:400;margin:26px 0 24px 3px}.fw-intro{font-size:13px;line-height:1.7;color:var(--fw-muted);max-width:265px;margin:0 0 0 5px}.fw-explore{pointer-events:auto;display:inline-flex;align-items:center;gap:15px;font-size:11px!important;margin:25px 0 0 3px;padding:0!important}.fw-explore>span:first-child{width:38px;height:38px;display:grid;place-items:center;background:var(--fw-accent);color:var(--fw-bg);border-radius:50%;transition:transform .25s}.fw-explore:hover>span:first-child{transform:rotate(-30deg)}.fw-stage{position:absolute;left:35%;right:-3.5%;top:0;bottom:0;z-index:1;outline-offset:-8px!important;touch-action:pan-y;cursor:grab}.fw-stage:active{cursor:grabbing}.fw-stage canvas{width:100%;height:100%;display:block;opacity:0;transition:opacity .7s}.fw-stage[data-ready="true"] canvas{opacity:1}.fw-stage-shadow{position:absolute;left:26%;right:17%;bottom:10%;height:10%;background:radial-gradient(ellipse,color-mix(in srgb,var(--fw-ink) 17%,transparent),transparent 68%);filter:blur(16px);pointer-events:none}.fw-stage-reticle{position:absolute;width:5px;height:5px;color:var(--fw-muted);pointer-events:none}.fw-stage-reticle:before,.fw-stage-reticle:after{content:"";position:absolute;background:currentColor;opacity:.6}.fw-stage-reticle:before{height:1px;width:9px;left:-4px}.fw-stage-reticle:after{height:9px;width:1px;top:-4px}.fw-reticle-a{top:15%;left:19%}.fw-reticle-b{bottom:20%;right:13%}.fw-object-label{position:absolute;right:0;top:37px;text-align:right;color:var(--fw-muted);z-index:2;pointer-events:none}.fw-object-label strong{display:block;color:var(--fw-ink);font-weight:400;margin-bottom:3px}.fw-stage-caption{position:absolute;bottom:40px;left:62%;display:flex;align-items:center;gap:11px;z-index:2;color:var(--fw-muted);pointer-events:none}.fw-stage-caption svg{width:18px;height:18px}.fw-current{position:absolute;left:47%;top:46%;font-family:Georgia,serif;font-size:210px;font-style:italic;line-height:1;color:var(--fw-ink);opacity:.035;z-index:0;pointer-events:none}.fw-fallback{position:absolute;inset:20%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px;color:var(--fw-muted);text-align:center;pointer-events:none}.fw-fallback svg{width:80%;height:80%;stroke:var(--fw-ink);stroke-width:.5}.fw-fallback p{font-size:11px;line-height:1.6;max-width:230px;margin:0}.fw-toolbar{position:relative;display:flex;align-items:center;justify-content:space-between;gap:20px;border-top:1px solid var(--fw-line);padding:18px 0;z-index:4}.fw-toolbar-heading{color:var(--fw-muted);display:flex;align-items:center;gap:14px}.fw-toolbar-heading b{font-weight:400;color:var(--fw-ink)}.fw-actions{display:flex;align-items:center;gap:24px}.fw-action{display:flex;align-items:center;gap:8px;font-size:11px!important;padding:6px 0!important;white-space:nowrap}.fw-action svg{width:14px;height:14px}.fw-action[aria-expanded="true"]{color:var(--fw-accent)}.fw-studies{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-bottom:1px solid var(--fw-line)}.fw-study{position:relative;padding:24px 20px 24px 0!important;display:grid;grid-template-columns:31px 1fr 88px;align-items:center;gap:8px;text-align:left;border-top:1px solid var(--fw-line)!important;transition:background .25s;min-width:0}.fw-study+.fw-study{padding-left:24px!important}.fw-study+.fw-study:before{content:"";position:absolute;height:50%;left:0;top:25%;width:1px;background:var(--fw-line)}.fw-study:after{content:"";position:absolute;height:2px;background:var(--fw-accent);top:-1px;left:0;right:0;transform:scaleX(0);transform-origin:left;transition:transform .4s}.fw-study[aria-pressed="true"]:after{transform:scaleX(1)}.fw-study-number{font-size:10px;align-self:start;margin-top:7px;color:var(--fw-muted)}.fw-study[aria-pressed="true"] .fw-study-number{color:var(--fw-accent)}.fw-study-name{font-size:32px;font-weight:400;letter-spacing:-1.2px;display:block;margin-bottom:7px}.fw-study-note{font-size:11px;color:var(--fw-muted);display:block}.fw-study svg{height:65px;width:88px;stroke:var(--fw-muted);stroke-width:.7;transition:transform .5s}.fw-study:hover svg{transform:rotate(-10deg)}.fw-study[aria-pressed="true"] svg{stroke:var(--fw-accent)}.fw-footer{min-height:75px;display:flex;align-items:center;justify-content:space-between;gap:24px;color:var(--fw-muted)}.fw-footer>span:first-child{font-size:11px}.fw-footer em{font-family:Georgia,serif;font-size:14px;font-style:italic}.fw-live{display:flex;align-items:center;gap:8px}.fw-panel{position:absolute;right:0;bottom:calc(100% + 12px);width:304px;background:var(--fw-bg);border:1px solid var(--fw-line);box-shadow:0 12px 45px #0000000c;padding:24px;animation:fw-in .25s ease}.fw-panel-title{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;font-size:14px}.fw-close{width:28px;height:28px;font-size:22px!important;line-height:1;padding:0!important}.fw-control-label{display:flex;align-items:center;justify-content:space-between;font-size:11px;color:var(--fw-muted);margin:16px 0 13px}.fw-finishes{display:flex;gap:8px}.fw-finish{padding:9px 10px!important;display:flex;gap:6px;align-items:center;font-size:10px!important;border:1px solid var(--fw-line)!important}.fw-finish[aria-pressed="true"]{border-color:var(--fw-ink)!important}.fw-swatch{height:9px;width:9px;border-radius:50%;background:linear-gradient(130deg,#fcfcfc,#6b6e73,#d7d9df)}.fw-swatch-copper{background:linear-gradient(130deg,#f0c2a1,#8f4932,#e4aa7d)}.fw-swatch-ink{background:linear-gradient(130deg,#737773,#151a19,#494f4d)}.fw-slider{width:100%;height:3px;accent-color:var(--fw-accent);display:block;margin:18px 0 8px;cursor:pointer}.fw-panel-note{font-size:10px;line-height:1.6;color:var(--fw-muted);margin:20px 0 0}.fw-about{position:absolute;right:0;top:calc(100% + 12px);width:min(420px,90cqw);background:var(--fw-ink);color:var(--fw-bg);padding:30px;box-shadow:0 20px 60px #0002;animation:fw-in .25s ease}.fw-about h2{font-family:Georgia,serif;font-size:34px;font-weight:400;letter-spacing:-1px;line-height:1.1;margin:12px 0 22px}.fw-about p{font-size:13px;line-height:1.8;opacity:.8}.fw-about .fw-panel-title{margin:0}.fw-about .fw-mono{font-size:9px}.fw-about-rule{height:1px;background:currentColor;opacity:.2;margin:24px 0 18px}.fw-sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}.fw-root[data-reduced="true"] *{animation:none!important;transition:none!important}@keyframes fw-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@container (min-width:1600px){.fw-hero{height:740px;min-height:740px}.fw-editorial{padding-top:60px}.fw-title{margin-top:45px}.fw-subtitle{margin-top:35px}.fw-intro{font-size:14px}}
@container (max-width:1000px){.fw-header-center{margin-left:0}.fw-hero{min-height:620px}.fw-title{font-size:12.5cqw}.fw-editorial{padding-top:45px}.fw-subtitle{font-size:30px}.fw-stage{left:32%;right:-8%}.fw-intro{max-width:230px}.fw-study{grid-template-columns:24px 1fr 65px}.fw-study svg{width:65px}.fw-study-name{font-size:27px}.fw-study-note{font-size:10px}.fw-footer>span:first-child{max-width:250px;line-height:1.6}.fw-toolbar-heading{gap:8px}.fw-actions{gap:18px}}
@container (max-width:700px){.fw-shell{padding:0 22px}.fw-header{height:78px}.fw-brand{font-size:23px}.fw-header-center{display:none}.fw-about-button{font-size:11px!important;gap:10px;min-height:44px}.fw-hero{height:auto;min-height:0;display:flex;flex-direction:column;padding-bottom:0}.fw-editorial{width:100%;padding-top:32px}.fw-kicker{font-size:9px}.fw-title{font-size:22.6cqw;line-height:.86;margin:28px 0 0 -5px;letter-spacing:-.085em}.fw-title .fw-title-second{margin-left:21cqw}.fw-title sup{font-size:12px;top:-.5em;margin-left:6px}.fw-subtitle{font-size:29px;margin:21px 0 14px;letter-spacing:-1px}.fw-intro{max-width:265px;font-size:12px;line-height:1.65;margin:0}.fw-explore{margin:18px 0 0;gap:12px}.fw-explore>span:first-child{height:32px;width:32px}.fw-explore svg{width:16px}.fw-stage{position:relative;left:auto;right:auto;width:calc(100% + 44px);margin:4px -22px 0;aspect-ratio:1.13;min-height:310px;max-height:520px}.fw-object-label{top:auto;bottom:44px;left:0;right:auto;text-align:left;font-size:8px;line-height:1.6}.fw-stage-caption{bottom:22px;left:auto;right:0;font-size:8px;gap:6px}.fw-stage-caption svg{width:15px}.fw-stage-shadow{bottom:8%;left:25%;right:25%}.fw-current{font-size:150px;left:40%;top:auto;bottom:65px}.fw-reticle-a{top:20%;left:14%}.fw-reticle-b{bottom:16%;right:14%}.fw-toolbar{padding:14px 0;gap:8px;align-items:flex-start}.fw-toolbar-heading{font-size:8px;display:block;line-height:1.7;max-width:75px;padding-top:8px}.fw-toolbar-heading>span{display:none}.fw-toolbar-heading:after{content:"01 / 03";display:block}.fw-toolbar-heading b{display:block}.fw-toolbar-heading .fw-toolbar-dash{display:none}.fw-actions{gap:10px;align-items:center}.fw-action{font-size:10px!important;gap:5px;padding:5px 0!important;min-height:44px;min-width:44px;justify-content:center}.fw-action svg{width:12px}.fw-action .fw-reset-label{display:none}.fw-study{padding:19px 8px 18px 0!important;display:flex;flex-wrap:wrap;gap:0}.fw-study+.fw-study{padding-left:14px!important}.fw-study-number{width:100%;margin:0 0 10px;font-size:9px}.fw-study-name{font-size:25px;margin-bottom:0}.fw-study-note{display:none}.fw-study svg{width:58px;height:49px;margin:10px 0 0;display:block}.fw-study-copy{width:100%}.fw-study+.fw-study:before{height:55%;top:23%}.fw-footer{padding:22px 0;min-height:100px;gap:14px;flex-wrap:wrap}.fw-footer>span:first-child{width:100%;max-width:none;font-size:10px}.fw-footer em{font-size:13px}.fw-footer .fw-live{font-size:8px}.fw-panel{width:min(304px,calc(100cqw - 44px));right:0}.fw-finish{min-height:44px}.fw-close{min-width:44px;min-height:44px}.fw-slider{height:20px}.fw-about{padding:24px}.fw-about h2{font-size:30px}}
@media(prefers-reduced-motion:reduce){.fw-root *{animation:none!important;transition:none!important}}
`

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1440
 * @framerIntrinsicHeight 1000
 */
export default function Fieldwork({
    studioName = "fieldwork", firstWord = "FIELD", secondWord = "WORK",
    introduction = "An ongoing exploration of form, tension, and the beauty in between. Made to be played with.",
    background = "#EEECE6", ink = "#252620", accent = "#CB4728",
    initialStudy = "orbit", finish = "chrome", speed = 1, autoRotate = true,
    showSettings = true, style,
}: Props) {
    const [study, setStudy] = React.useState<Study>(initialStudy)
    const [material, setMaterial] = React.useState<Finish>(finish)
    const [rate, setRate] = React.useState(speed)
    const [playing, setPlaying] = React.useState(autoRotate)
    const [reduced, setReduced] = React.useState(false)
    const [settingsOpen, setSettingsOpen] = React.useState(false)
    const [aboutOpen, setAboutOpen] = React.useState(false)
    const [sceneVersion, setSceneVersion] = React.useState(0)
    const [status, setStatus] = React.useState<"loading" | "ready" | "error">("loading")
    const stageRef = React.useRef<HTMLDivElement>(null)
    const settingsRef = React.useRef<HTMLButtonElement>(null)
    const aboutRef = React.useRef<HTMLButtonElement>(null)
    const rootRef = React.useRef<HTMLDivElement>(null)
    const engineRef = React.useRef<{ wake: () => void; reset: () => void } | null>(null)
    const config = React.useRef({ study, material, rate, playing, reduced })
    const uid = React.useId().replace(/:/g, "")
    const index = Math.max(0, studies.findIndex(s => s.id === study))
    const current = studies[index]
    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    React.useEffect(() => setStudy(initialStudy), [initialStudy])
    React.useEffect(() => setMaterial(finish), [finish])
    React.useEffect(() => setRate(speed), [speed])
    React.useEffect(() => setPlaying(autoRotate), [autoRotate])
    React.useEffect(() => { if (!showSettings) setSettingsOpen(false) }, [showSettings])
    React.useEffect(() => {
        const media = window.matchMedia("(prefers-reduced-motion: reduce)")
        const update = () => setReduced(media.matches)
        update()
        media.addEventListener("change", update)
        return () => media.removeEventListener("change", update)
    }, [])
    React.useEffect(() => {
        config.current = { study, material, rate, playing, reduced }
        engineRef.current?.wake()
    }, [study, material, rate, playing, reduced])
    React.useEffect(() => {
        if (!settingsOpen && !aboutOpen) return
        const dismiss = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return
            if (settingsOpen) { setSettingsOpen(false); settingsRef.current?.focus() }
            if (aboutOpen) { setAboutOpen(false); aboutRef.current?.focus() }
        }
        const outside = (event: PointerEvent) => {
            if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
                setAboutOpen(false); setSettingsOpen(false)
            }
        }
        document.addEventListener("keydown", dismiss)
        document.addEventListener("pointerdown", outside)
        return () => { document.removeEventListener("keydown", dismiss); document.removeEventListener("pointerdown", outside) }
    }, [settingsOpen, aboutOpen])

    React.useEffect(() => {
        const host = stageRef.current
        if (!host) return
        let alive = true
        let teardown = () => {}
        let timeout: ReturnType<typeof setTimeout> | undefined
        setStatus("loading")
        // Loading the library inside the effect keeps server rendering browser-free.
        const load = import("https://esm.sh/three@0.180.0")
        const deadline = new Promise<never>((_, reject) => {
            timeout = setTimeout(() => reject(new Error("3D library could not be loaded")), 18000)
        })
        Promise.race([load, deadline]).then(THREE => {
            clearTimeout(timeout)
            if (!alive) return
            const owned: { dispose: () => void }[] = []
            const own = <T extends { dispose: () => void },>(item: T): T => { owned.push(item); return item }
            let renderer: InstanceType<typeof THREE.WebGLRenderer> | undefined
            let frame = 0
            let resizeObserver: ResizeObserver | undefined
            let intersectionObserver: IntersectionObserver | undefined
            const removers: (() => void)[] = []
            const releaseOwned = () => owned.splice(0).reverse().forEach(item => item.dispose())
            teardown = () => {
                cancelAnimationFrame(frame)
                resizeObserver?.disconnect()
                intersectionObserver?.disconnect()
                removers.forEach(remove => remove())
                releaseOwned()
                if (renderer) { renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove() }
                engineRef.current = null
            }
            try {
                renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" })
                renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
                renderer.setClearColor(0x000000, 0)
                renderer.outputColorSpace = THREE.SRGBColorSpace
                renderer.toneMapping = THREE.ACESFilmicToneMapping
                renderer.toneMappingExposure = 1.08
                renderer.domElement.setAttribute("aria-hidden", "true")
                host.appendChild(renderer.domElement)
                const scene = new THREE.Scene()
                const camera = new THREE.PerspectiveCamera(34, 1, .1, 50)
                camera.position.set(0, 0, 8.8)
                const sculpture = new THREE.Group()
                scene.add(sculpture)

                // Procedural softboxes and black flags produce studio reflections without HDR files.
                const studio = new THREE.Scene()
                studio.background = new THREE.Color("#5b5b5b")
                const boxGeometry = own(new THREE.BoxGeometry(1, 1, 1))
                const panels = [
                    { p: [-4, 3, 2], s: [2.7, 7, .2], c: "#ffffff", intensity: 3.5 },
                    { p: [4, 2, 0], s: [1.5, 6, .2], c: "#ffffff", intensity: 4 },
                    { p: [0, 5, -1], s: [7, .2, 4], c: "#ffffff", intensity: 3 },
                    { p: [0, -4, 0], s: [8, .2, 8], c: "#151515", intensity: 1 },
                    { p: [0, 0, 5], s: [2.5, 6, .2], c: "#101010", intensity: 1 },
                    { p: [-1, 1, -5], s: [4, 7, .2], c: "#080808", intensity: 1 },
                    { p: [2, -1, -4], s: [.5, 5, .2], c: "#eeeeee", intensity: 2.5 },
                ]
                panels.forEach(({ p, s, c, intensity }) => {
                    const mat = own(new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(intensity) }))
                    const panel = new THREE.Mesh(boxGeometry, mat)
                    panel.position.set(p[0], p[1], p[2]); panel.scale.set(s[0], s[1], s[2]); panel.lookAt(0, 0, 0)
                    studio.add(panel)
                })
                const pmrem = new THREE.PMREMGenerator(renderer)
                let environment: ReturnType<typeof pmrem.fromScene>
                try { environment = own(pmrem.fromScene(studio, .025, .1, 30)) } finally { pmrem.dispose() }
                scene.environment = environment.texture
                const key = new THREE.DirectionalLight(0xffffff, 1.5)
                key.position.set(-3, 5, 4); scene.add(key)
                const rim = new THREE.DirectionalLight(0xffffff, 1.2)
                rim.position.set(4, 0, -2); scene.add(rim)

                // A rounded rectangular cross section makes each ring a broad cast-metal ribbon.
                const segments = 144, sides = 20
                const positions: number[] = [], normals: number[] = [], indices: number[] = []
                const signedPower = (x: number, n: number) => Math.sign(x) * Math.pow(Math.abs(x), n)
                for (let a = 0; a <= segments; a++) {
                    const angle = a / segments * Math.PI * 2
                    for (let b = 0; b <= sides; b++) {
                        const phi = b / sides * Math.PI * 2
                        const radial = 1.35 + .125 * signedPower(Math.cos(phi), .65)
                        const z = .055 * signedPower(Math.sin(phi), .65)
                        positions.push(radial * Math.cos(angle), radial * Math.sin(angle), z)
                        const nr = signedPower(Math.cos(phi), 1.35) / .125
                        const nz = signedPower(Math.sin(phi), 1.35) / .055
                        const length = Math.hypot(nr, nz)
                        normals.push(nr / length * Math.cos(angle), nr / length * Math.sin(angle), nz / length)
                        if (a < segments && b < sides) {
                            const v = a * (sides + 1) + b
                            indices.push(v, v + 1, v + sides + 1, v + 1, v + sides + 2, v + sides + 1)
                        }
                    }
                }
                const geometry = own(new THREE.BufferGeometry())
                geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
                geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3))
                geometry.setIndex(indices)
                geometry.computeBoundingSphere()
                const metal = own(new THREE.MeshStandardMaterial({ color: "#dadde1", metalness: 1, roughness: .17, envMapIntensity: 1.35, side: THREE.DoubleSide }))
                const ribbons = Array.from({ length: 11 }, () => {
                    const mesh = new THREE.Mesh(geometry, metal)
                    sculpture.add(mesh)
                    return mesh
                })
                const arrangement = (kind: Study, i: number) => {
                    const u = (i - 5) / 5
                    const euler = new THREE.Euler()
                    const position = new THREE.Vector3()
                    const scale = new THREE.Vector3(1, 1, 1)
                    if (kind === "helix") {
                        const a = i * .53
                        position.set(Math.sin(a) * .3, u * 1.25, Math.cos(a) * .24)
                        euler.set(1.18 + Math.sin(a) * .12, Math.cos(a) * .12, Math.sin(a) * .1)
                        scale.setScalar(.86 - Math.abs(u) * .08)
                    } else if (kind === "bloom") {
                        const a = i / 11 * Math.PI * 2
                        position.set(Math.cos(a) * .68, Math.sin(a) * .68, Math.sin(a * 2) * .07)
                        euler.set(.16 * Math.cos(a), .16 * Math.sin(a), a - Math.PI / 2)
                        scale.set(.48, .88, 1)
                    } else {
                        position.set(Math.sin(u * 1.7) * .1, u * .06, u * .36)
                        euler.set(u * .87, u * .32, u * .08)
                        scale.set(1, 1.08, 1)
                    }
                    return { position, scale, quaternion: new THREE.Quaternion().setFromEuler(euler) }
                }
                let targets = ribbons.map((_, i) => arrangement(config.current.study, i))
                const copyTargets = () => ribbons.forEach((mesh, i) => {
                    mesh.position.copy(targets[i].position); mesh.quaternion.copy(targets[i].quaternion); mesh.scale.copy(targets[i].scale)
                })
                copyTargets()
                let previousStudy = config.current.study
                let previousMaterial = ""
                let motionTime = 0, lastTime = 0, settling = 2
                let inView = true, contextLost = false, sized = false
                let drag: { id: number; x: number; y: number } | null = null
                let yaw = -.38, pitch = -.18, targetYaw = yaw, targetPitch = pitch
                const paintMaterial = () => {
                    const selected = config.current.material
                    if (previousMaterial === selected) return
                    previousMaterial = selected
                    metal.color.set(selected === "copper" ? "#bd7451" : selected === "ink" ? "#252c2c" : "#dadde1")
                    metal.roughness = selected === "ink" ? .3 : .17
                }
                const canAnimate = () => config.current.playing && !config.current.reduced && !isCanvas && config.current.rate > 0
                const tick = (now: number) => {
                    frame = 0
                    if (!alive || contextLost || !sized || !inView || document.hidden) return
                    const dt = lastTime ? Math.min((now - lastTime) / 1000, .05) : 1 / 60
                    lastTime = now
                    const cfg = config.current
                    if (cfg.study !== previousStudy) {
                        previousStudy = cfg.study
                        targets = ribbons.map((_, i) => arrangement(cfg.study, i))
                        settling = 1.8
                    }
                    paintMaterial()
                    const lerp = cfg.reduced || isCanvas ? 1 : 1 - Math.exp(-dt * 4.5)
                    ribbons.forEach((mesh, i) => {
                        mesh.position.lerp(targets[i].position, lerp)
                        mesh.quaternion.slerp(targets[i].quaternion, lerp)
                        mesh.scale.lerp(targets[i].scale, lerp)
                    })
                    if (canAnimate() && !drag) motionTime += dt * .075 * Math.max(0, cfg.rate)
                    yaw += (targetYaw - yaw) * lerp
                    pitch += (targetPitch - pitch) * lerp
                    sculpture.rotation.set(pitch, yaw + motionTime, -.3)
                    renderer!.render(scene, camera)
                    settling -= dt
                    if (canAnimate() || settling > 0 || drag) frame = requestAnimationFrame(tick)
                }
                const wake = () => {
                    settling = Math.max(settling, 1.8)
                    if (!frame && !contextLost && alive) { lastTime = 0; frame = requestAnimationFrame(tick) }
                }
                const reset = () => { targetYaw = -.38; targetPitch = -.18; motionTime = 0; wake() }
                engineRef.current = { wake, reset }
                const resize = () => {
                    const { width, height } = host.getBoundingClientRect()
                    sized = width > 0 && height > 0
                    if (!sized) return
                    renderer!.setSize(width, height, false)
                    camera.aspect = width / height
                    camera.position.z = camera.aspect < 1 ? 9.5 : 8.8
                    camera.updateProjectionMatrix()
                    wake()
                }
                resizeObserver = new ResizeObserver(resize)
                resizeObserver.observe(host)
                intersectionObserver = new IntersectionObserver(entries => {
                    inView = entries[0]?.isIntersecting ?? true
                    if (inView) wake()
                    else { cancelAnimationFrame(frame); frame = 0 }
                }, { rootMargin: "80px" })
                intersectionObserver.observe(host)
                const listen = (target: EventTarget, name: string, handler: EventListener) => {
                    target.addEventListener(name, handler)
                    removers.push(() => target.removeEventListener(name, handler))
                }
                listen(host, "pointerdown", ((event: PointerEvent) => {
                    if (event.button !== 0 || isCanvas) return
                    drag = { id: event.pointerId, x: event.clientX, y: event.clientY }
                    host.setPointerCapture(event.pointerId)
                    wake()
                }) as EventListener)
                listen(host, "pointermove", ((event: PointerEvent) => {
                    if (!drag || drag.id !== event.pointerId) return
                    targetYaw += (event.clientX - drag.x) * .007
                    targetPitch = Math.max(-1.1, Math.min(1.1, targetPitch + (event.clientY - drag.y) * .005))
                    drag.x = event.clientX; drag.y = event.clientY; wake()
                }) as EventListener)
                const release = ((event: PointerEvent) => {
                    if (drag?.id !== event.pointerId) return
                    drag = null
                    if (host.hasPointerCapture(event.pointerId)) host.releasePointerCapture(event.pointerId)
                    wake()
                }) as EventListener
                listen(host, "pointerup", release); listen(host, "pointercancel", release); listen(host, "lostpointercapture", release)
                listen(host, "keydown", ((event: KeyboardEvent) => {
                    if (event.key.startsWith("Arrow")) {
                        event.preventDefault()
                        if (event.key === "ArrowLeft") targetYaw -= .2
                        if (event.key === "ArrowRight") targetYaw += .2
                        if (event.key === "ArrowUp") targetPitch = Math.max(-1.1, targetPitch - .2)
                        if (event.key === "ArrowDown") targetPitch = Math.min(1.1, targetPitch + .2)
                        wake()
                    } else if (event.key === "Home") { event.preventDefault(); reset() }
                }) as EventListener)
                listen(document, "visibilitychange", (() => {
                    if (document.hidden) { cancelAnimationFrame(frame); frame = 0 } else wake()
                }) as EventListener)
                listen(renderer.domElement, "webglcontextlost", ((event: Event) => {
                    event.preventDefault(); contextLost = true; cancelAnimationFrame(frame); frame = 0
                    // Detach old GPU resource listeners before Three initializes a restored context.
                    releaseOwned()
                    if (alive) setStatus("error")
                }) as EventListener)
                listen(renderer.domElement, "webglcontextrestored", (() => {
                    // Rebuild procedural render targets; GPU context restoration clears their contents.
                    if (alive) setSceneVersion(version => version + 1)
                }) as EventListener)
                resize(); paintMaterial(); renderer.render(scene, camera)
                setStatus("ready")
            } catch (error) {
                teardown()
                teardown = () => {}
                if (alive) setStatus("error")
                console.warn("Fieldwork: 3D preview unavailable.", error)
            }
        }).catch(() => { clearTimeout(timeout); if (alive) setStatus("error") })
        return () => { alive = false; clearTimeout(timeout); teardown() }
    }, [isCanvas, sceneVersion])

    const chooseStudy = (next: Study) => { setStudy(next); setSettingsOpen(false); setAboutOpen(false) }
    const actuallyPlaying = playing && !reduced && !isCanvas && rate > 0 && status === "ready"

    return <div ref={rootRef} className="fw-root" data-reduced={reduced} style={{ "--fw-bg": background, "--fw-ink": ink, "--fw-accent": accent, ...style } as React.CSSProperties}>
        <style>{css}</style>
        <div className="fw-shell">
            <header className="fw-header">
                <div className="fw-brand"><span className="fw-brandmark" aria-hidden="true" />{studioName}</div>
                <div className="fw-header-center fw-mono"><span className="fw-dot" />Independent studies in form</div>
                <button ref={aboutRef} className="fw-about-button" aria-expanded={aboutOpen} aria-controls={`${uid}-about`} onClick={() => { setAboutOpen(!aboutOpen); setSettingsOpen(false) }}>About the study <Arrow diagonal /></button>
                {aboutOpen && <section id={`${uid}-about`} className="fw-about" aria-label="About the study">
                    <div className="fw-panel-title"><span className="fw-mono">A digital playground</span><button className="fw-close" aria-label="Close about" onClick={() => { setAboutOpen(false); aboutRef.current?.focus() }}>×</button></div>
                    <h2>A small experiment.<br />An open-ended outcome.</h2>
                    <p>What happens when the same eleven ribbons find a different relationship to one another? FIELDWORK is a collection of three interactive studies in repetition, tension, and change.</p>
                    <div className="fw-about-rule" />
                    <p>Choose a study. Drag to look around. Change the finish, slow things down, or let a form stand still.</p>
                    <p className="fw-mono">Keyboard: focus the sculpture, then use arrow keys. Home resets the view.</p>
                </section>}
            </header>
            <main>
                <section className="fw-hero" aria-label="Interactive sculpture exhibit">
                    <div className="fw-editorial">
                        <div className="fw-kicker fw-mono">An exploration, in three acts</div>
                        <h1 className="fw-title"><span>{firstWord}</span><span className="fw-title-second">{secondWord}</span></h1>
                        <h2 className="fw-subtitle">Nothing stays in shape.</h2>
                        <p className="fw-intro">{introduction}</p>
                        <button className="fw-explore" onClick={() => chooseStudy(studies[(index + 1) % studies.length].id)}><span><Arrow /></span><span>Change your perspective</span></button>
                    </div>
                    <span className="fw-current" aria-hidden="true">0{index + 1}</span>
                    <div className="fw-stage" ref={stageRef} data-ready={status === "ready"} tabIndex={0} role="group" aria-roledescription="interactive 3D sculpture" aria-label={`${current.name} sculpture. Drag or use arrow keys to rotate; Home resets the view.`}>
                        <div className="fw-stage-shadow" />
                        <span className="fw-stage-reticle fw-reticle-a" /><span className="fw-stage-reticle fw-reticle-b" />
                        {status !== "ready" && <div className="fw-fallback" role="status"><StudyDrawing study={study} /><p>{status === "loading" ? "Preparing the study…" : "A still study. Interactive 3D is unavailable in this browser."}</p></div>}
                    </div>
                    <div className="fw-object-label fw-mono"><strong>Fig. 0{index + 1} / {current.name}</strong>{material === "chrome" ? "Polished chrome" : material === "copper" ? "Warm copper" : "Blackened metal"}<br />11 elements / ∞ arrangements</div>
                    <div className="fw-stage-caption fw-mono"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" transform="rotate(-32 12 12)" /><path d="m17 4 3 1-1 3" stroke="currentColor" /></svg>Drag to explore</div>
                </section>
                <div className="fw-toolbar">
                    <div className="fw-toolbar-heading fw-mono"><b>The studies</b><span>Same elements. New possibilities.</span></div>
                    <div className="fw-actions">
                        <button className="fw-action" disabled={reduced || isCanvas || rate === 0 || status !== "ready"} onClick={() => setPlaying(!playing)} aria-label={actuallyPlaying ? "Pause rotation" : "Play rotation"}>
                            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">{actuallyPlaying ? <path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="1.5" /> : <path d="m5 3 8 5-8 5z" stroke="currentColor" />}</svg>{actuallyPlaying ? "Pause" : "Play"}
                        </button>
                        <button className="fw-action" aria-label="Reset view" disabled={status !== "ready"} onClick={() => engineRef.current?.reset()}><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 6a5.5 5.5 0 1 1-.5 4M3 2v4h4" stroke="currentColor" strokeWidth="1.2" /></svg><span className="fw-reset-label">Reset view</span></button>
                        {showSettings && <button ref={settingsRef} className="fw-action" aria-expanded={settingsOpen} aria-controls={`${uid}-settings`} onClick={() => { setSettingsOpen(!settingsOpen); setAboutOpen(false) }}><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M1 5h4m4 0h6M1 11h7m4 0h3" stroke="currentColor" /><circle cx="7" cy="5" r="2" stroke="currentColor" /><circle cx="10" cy="11" r="2" stroke="currentColor" /></svg>Adjust</button>}
                    </div>
                    {settingsOpen && showSettings && <section className="fw-panel" id={`${uid}-settings`} aria-label="Sculpture settings">
                        <div className="fw-panel-title">Make it your own<button className="fw-close" aria-label="Close settings" onClick={() => { setSettingsOpen(false); settingsRef.current?.focus() }}>×</button></div>
                        <span className="fw-control-label">Surface finish</span>
                        <div className="fw-finishes">{(["chrome", "copper", "ink"] as Finish[]).map(f => <button key={f} className="fw-finish" aria-pressed={material === f} onClick={() => setMaterial(f)}><span className={`fw-swatch fw-swatch-${f}`} />{f.charAt(0).toUpperCase() + f.slice(1)}</button>)}</div>
                        <label className="fw-control-label" htmlFor={`${uid}-speed`}>Rotation speed <span>{rate.toFixed(1)}×</span></label>
                        <input id={`${uid}-speed`} className="fw-slider" type="range" min="0" max="2" step="0.1" value={rate} onChange={event => setRate(Number(event.target.value))} />
                        <p className="fw-panel-note">{reduced ? "Reduced motion is on. Forms change instantly and automatic rotation stays off." : "The form is yours to explore. Drag the sculpture to find another angle."}</p>
                    </section>}
                </div>
                <nav className="fw-studies" aria-label="Choose a sculpture study">{studies.map((s, i) => <button key={s.id} className="fw-study" aria-pressed={study === s.id} aria-label={`${s.name}: ${s.note}`} onClick={() => chooseStudy(s.id)}><span className="fw-study-number fw-mono">0{i + 1}</span><span className="fw-study-copy"><span className="fw-study-name">{s.name}</span><span className="fw-study-note">{s.note}</span></span><StudyDrawing study={s.id} /></button>)}</nav>
                <p className="fw-sr-only" aria-live="polite">{current.name}. {current.description}</p>
            </main>
            <footer className="fw-footer"><span>A digital playground by {studioName}. Curiosity encouraged.</span><em>Form is never final.</em><span className="fw-live fw-mono"><span className="fw-dot" />{status === "loading" ? "Preparing the study" : status === "error" ? "Still study" : reduced ? "Reduced motion" : actuallyPlaying ? "In perpetual motion" : "A moment of stillness"}</span></footer>
        </div>
    </div>
}

addPropertyControls(Fieldwork, {
    studioName: { type: ControlType.String, title: "Studio", defaultValue: "fieldwork" },
    firstWord: { type: ControlType.String, title: "First word", defaultValue: "FIELD" },
    secondWord: { type: ControlType.String, title: "Second word", defaultValue: "WORK" },
    introduction: { type: ControlType.String, title: "Introduction", displayTextArea: true, defaultValue: "An ongoing exploration of form, tension, and the beauty in between. Made to be played with." },
    background: { type: ControlType.Color, title: "Background", defaultValue: "#EEECE6" },
    ink: { type: ControlType.Color, title: "Ink", defaultValue: "#252620" },
    accent: { type: ControlType.Color, title: "Accent", defaultValue: "#CB4728" },
    initialStudy: { type: ControlType.Enum, title: "Initial study", options: ["orbit", "helix", "bloom"], optionTitles: ["Orbit", "Helix", "Bloom"], defaultValue: "orbit" },
    finish: { type: ControlType.Enum, title: "Finish", options: ["chrome", "copper", "ink"], optionTitles: ["Chrome", "Copper", "Ink"], defaultValue: "chrome" },
    speed: { type: ControlType.Number, title: "Speed", min: 0, max: 2, step: .1, defaultValue: 1 },
    autoRotate: { type: ControlType.Boolean, title: "Auto rotate", defaultValue: true },
    showSettings: { type: ControlType.Boolean, title: "Show settings", defaultValue: true },
})
