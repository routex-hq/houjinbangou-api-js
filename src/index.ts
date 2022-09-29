import { XMLParser, XMLValidator } from 'fast-xml-parser'

import { ENDPOINTS, HOUJINBANGOU_API_BASE_URL } from './constants'
import type { diffRequestQuery, nameRequestQuery, numRequestQuery, ResponseData } from './types'

export class HoujinbangouAPIClient {
    protected zero_pad(num: number): string {
        return num.toString().padStart(2, '0')
    }

    private getUrl(endpoint: ENDPOINTS): URL {
        const url_obj = new URL(HOUJINBANGOU_API_BASE_URL)
        url_obj.pathname = `/${this.$version}${endpoint}`
        url_obj.searchParams.set('id', this.$id)
        return url_obj
    }

    constructor(private $id: string, private $version = '4') {}

    public async num(query: numRequestQuery): Promise<ResponseData> {
        const url = this.getUrl(ENDPOINTS.Num)

        if (typeof query.number !== 'string') query.number = query.number.join(',')

        query.type = '12'
        url.searchParams.set('number', query.number)
        url.searchParams.set('type', query.type)
        url.searchParams.set('history', `${query.history || '0'}`)
        const res = await fetch(url.toString())

        const parser = new XMLParser()
        const text = await res.text()
        const isXml = XMLValidator.validate(text)
        if (isXml == true) {
            const json = parser.parse(text)
            return json
        } else {
            throw isXml
        }
    }

    public async diff(query: diffRequestQuery): Promise<ResponseData> {
        const url = this.getUrl(ENDPOINTS.Diff)

        if (typeof query.kind === 'number') {
            query.kind = this.zero_pad(query.kind) as '01' | '02' | '03' | '04'
        }
        if (typeof query.from !== 'string') {
            query.from = [
                this.zero_pad(query.from.getFullYear()),
                this.zero_pad(query.from.getMonth()),
                this.zero_pad(query.from.getDate()),
            ].join('-')
        }
        if (typeof query.to !== 'string') {
            query.to = [
                this.zero_pad(query.to.getFullYear()),
                this.zero_pad(query.to.getMonth()),
                this.zero_pad(query.to.getDate()),
            ].join('-')
        }

        query.type = '12'

        url.searchParams.set('from', query.from)
        url.searchParams.set('to', query.to)
        url.searchParams.set('type', query.type)

        if (query.address) url.searchParams.set('address', query.address)
        if (query.divide) url.searchParams.set('divide', `${query.divide}`)
        if (query.kind) url.searchParams.set('address', query.kind)

        const res = await fetch(url.toString())

        const parser = new XMLParser()
        const text = await res.text()
        const isXml = XMLValidator.validate(text)
        if (isXml == true) {
            const json = parser.parse(text)
            return json
        } else {
            throw isXml
        }
    }

    public async name(query: nameRequestQuery): Promise<ResponseData> {
        const url = this.getUrl(ENDPOINTS.Name)

        if (typeof query.kind === 'number')
            query.kind = this.zero_pad(query.kind) as '01' | '02' | '03' | '04'

        if (typeof query.from !== 'undefined' && typeof query.from !== 'string')
            query.from = [
                this.zero_pad(query.from.getFullYear()),
                this.zero_pad(query.from.getMonth()),
                this.zero_pad(query.from.getDate()),
            ].join('-')

        if (typeof query.to !== 'undefined' && typeof query.to !== 'string')
            query.to = [
                this.zero_pad(query.to.getFullYear()),
                this.zero_pad(query.to.getMonth()),
                this.zero_pad(query.to.getDate()),
            ].join('-')

        query.type = '12'
        url.searchParams.set('type', query.type)
        url.searchParams.set('name', query.name)
        if (query.mode) url.searchParams.set('mode', query.mode)
        if (query.target) url.searchParams.set('target', `${query.target}`)
        if (query.address) url.searchParams.set('address', `${query.address}`)
        if (query.kind) url.searchParams.set('address', query.kind)
        if (query.change) url.searchParams.set('change', `${query.change}`)
        if (query.close) url.searchParams.set('close', `${query.close}`)
        if (query.from) url.searchParams.set('from', query.from)
        if (query.to) url.searchParams.set('to', query.to)
        if (query.divide) url.searchParams.set('divide', `${query.divide}`)

        const res = await fetch(url.toString())

        const parser = new XMLParser()
        const text = await res.text()
        const isXml = XMLValidator.validate(text)
        if (isXml == true) {
            const json = parser.parse(text)
            return json
        } else {
            throw isXml
        }
    }
}
