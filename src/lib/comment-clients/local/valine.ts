import Valine from 'valine'
import AV from 'leancloud-storage'

/** Valine otherwise injects LeanCloud's SDK from jsDelivr at runtime. */
export default class LocalValine {
  constructor(options: Record<string, unknown>) {
    const appId = String(options.appId || '')
    const appKey = String(options.appKey || '')
    const suffix = appId.slice(-9)
    const region = suffix === '-9Nh9j0Va' ? 'tab.' : suffix === '-MdYXbMMI' ? 'us.' : ''
    AV.init({ appId, appKey, serverURLs: `https://${region}avoscloud.com` })
    ;(globalThis as typeof globalThis & { AV?: typeof AV }).AV = AV
    new Valine(options)
  }
}
