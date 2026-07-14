import dns from 'dns'
import validator from 'validator'

export function emailValidator(email: string): Promise<boolean>{
    return new Promise((resolve) => {
        if(!email || !validator.isEmail(email)){
            return resolve(false)
        }

        const dominio = email.split('@')[1]

        dns.resolveMx(dominio, (err, adresses) => {
            if(err || !adresses || adresses.length === 0) {
                return resolve(false)
            }

            return resolve(true)
        })
    })
}