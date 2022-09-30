import dayjs from 'dayjs'
import { XMLParser, XMLValidator } from 'fast-xml-parser'

import { ENDPOINTS, HOUJINBANGOU_API_BASE_URL } from './constants'
import type { diffRequestQuery, nameRequestQuery, numRequestQuery, ResponseData } from './types'

type Option = {
    version: string
    customUrl?: string
}

export class HoujinbangouAPIClient {
    protected zero_pad(num: number): string {
        return num.toString().padStart(2, '0')
    }

    private getUrl(endpoint: ENDPOINTS): URL {
        const url = new URL(this.$option.customUrl || HOUJINBANGOU_API_BASE_URL)
        url.pathname = `/${this.$option.version}${endpoint}`
        url.searchParams.set('id', this.$id)
        return url
    }

    private parse(text: string) {
        const isXml = XMLValidator.validate(text)
        if (isXml == true) {
            const parser = new XMLParser()
            const json = parser.parse(text)
            return json
        } else {
            throw new Error(text)
        }
    }

    constructor(private $id: string, private $option: Option = { version: '4' }) {}

    public async num(query: numRequestQuery): Promise<ResponseData> {
        const url = this.getUrl(ENDPOINTS.Num)

        if (typeof query.number !== 'string') query.number = query.number.join(',')

        query.type = '12'
        url.searchParams.set('number', query.number)
        url.searchParams.set('type', query.type)
        url.searchParams.set('history', `${query.history || '0'}`)
        const res = await fetch(url.toString())

        const text = await res.text()
        return this.parse(text)
    }

    public async diff(query: diffRequestQuery): Promise<ResponseData> {
        const url = this.getUrl(ENDPOINTS.Diff)

        if (typeof query.kind === 'number')
            query.kind = this.zero_pad(query.kind) as '01' | '02' | '03' | '04'
        if (typeof query.from !== 'string') query.from = dayjs(query.from).format('YYYY-MM-DD')
        if (typeof query.to !== 'string') query.to = dayjs(query.to).format('YYYY-MM-DD')

        query.type = '12'

        url.searchParams.set('from', query.from)
        url.searchParams.set('to', query.to)
        url.searchParams.set('type', query.type)

        if (query.address) url.searchParams.set('address', query.address)
        if (query.divide) url.searchParams.set('divide', `${query.divide}`)
        if (query.kind) url.searchParams.set('address', query.kind)

        const res = await fetch(url.toString())

        const text = await res.text()
        return this.parse(text)
    }

    public async name(query: nameRequestQuery): Promise<ResponseData> {
        const url = this.getUrl(ENDPOINTS.Name)

        if (typeof query.kind === 'number')
            query.kind = this.zero_pad(query.kind) as '01' | '02' | '03' | '04'
        if (query.from && typeof query.from !== 'string')
            query.from = dayjs(query.from).format('YYYY-MM-DD')
        if (query.to && typeof query.to !== 'string')
            query.to = dayjs(query.to).format('YYYY-MM-DD')

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

        const text = await res.text()
        return this.parse(text)
    }
}
