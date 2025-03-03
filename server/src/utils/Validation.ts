import { Not } from 'typeorm'
import AppDataSource from '../DataSource'
import User from '../models/User'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'

const userRepo = AppDataSource.getRepository(User)
export const genSvg = (name: string) => {
    const initials = name.split(' ').map(w => w.charAt(0).toUpperCase()).slice(0, 5).join('')
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
        <circle cx="256" cy="256" r="256" fill="#000" />
        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-family="Times New Roman" font-size="128" fill="white">${initials}</text>
    </svg>`
    return Buffer.from(svg).toString('base64')
}
export const valName = (name: string) => {
    if (!name) {
        return "Name can't be empty!"
    } else if (name.length >= 75) {
        return "Name is too long!"
    }
    return
}
export const frmtName = (name: string) => {
    const nameParts = name.split(' ')
    const cap = nameParts.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    return name = cap.join(' ')
}
export const valUname = async (uname: string, user_id?: number) => {
    if (!uname) {
        return "Username can't be empty!"
    } else if (!/^[\w\d]+$/.test(uname)) {
        return "Username can only contain Latin Alphabets, Numbers, and Underscores!"
    } else if (uname.length >= 20) {
        return "Username is too long!"
    } else if (await userRepo.findOne({
        where: {
            username: frmtUname(uname),
            ...(user_id && { user_id: Not(user_id) })
        }
    })) {
        return "Username is unavailable!"
    }
    return
}
export const frmtUname = (uname: string) => uname.toLowerCase()
export const valEmail = async (email: string, user_id?: number) => {
    if (!email) {
        return "Email can't be empty!"
    } else if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return "Email must be valid!"
    } else if (await userRepo.findOne({
        where: {
            email,
            ...(user_id && { user_id: Not(user_id) })
        }
    })) {
        return "Email is already registered!"
    }
    return
}
export const Hash = async (pass: string) => {
    const genSecKey = () => {
        const ranges = [
            { s: 0x0020, e: 0x007E },
            { s: 0x00A1, e: 0x02FF },
            { s: 0x0370, e: 0x052F }
        ]
        const str: string[] = []
        ranges.forEach(r => {
            for (let i = r.s; i <= r.e; i++) str.push(String.fromCharCode(i))
        })
        let rslt = ''
        for (let i = 0; i < 2048; i++) {
            const shfl = Math.floor(Math.random() * str.length)
            rslt += str[shfl]
        }
        return rslt
    }
    const opt: argon2.Options = {
        hashLength: 4096,
        timeCost: 13,
        memoryCost: 1024 * 1024,
        parallelism: 13,
        type: 2,
        salt: Buffer.from(genSecKey(), 'utf-8')
    }
    return await argon2.hash(pass + process.env.PEPPER, opt)
}
export const verHash = async (pass: string, hashedPass: string) => await argon2.verify(hashedPass, pass + process.env.PEPPER)
export const genToken = (user_id: number) => jwt.sign({ user_id }, process.env.SECRET_KEY!, { algorithm: 'HS512', expiresIn: '30d' })
export const verToken = (t: string) => jwt.verify(t, process.env.SECRET_KEY!) as jwt.JwtPayload