import Ar from './Translations/Ar.json'

export const mixins = {
    methods: {
        trans(key, locale = 'en') {
            let t = key;
            if (locale == 'en') {
                return key;
            }
            Object.entries(Ar).forEach(([word, trans]) => {
                if (key == word) {
                    t = trans;
                }
            })
            return t;
        },
        __(key, locale = 'en') {
            let t = key;
            if (locale == 'en') {
                return key;
            }
            Object.entries(Ar).forEach(([word, trans]) => {
                if (key == word) {
                    t = trans;
                }
            })
            return t;
        }
    }
}
