let fs = require('fs');

let existingProxies = {};

function jsonProxy(filename) {
    if (filename in existingProxies) return existingProxies[filename];
    if (!fs.existsSync("data/"+filename)) fs.writeFileSync("data/"+filename, "{}", 'utf8', err=>console.error(err))
    let base = {data: JSON.parse(fs.readFileSync("data/"+filename, 'utf8'))};
    base.save = function() {
        if (base.timeout) {
            clearTimeout(base.timeout)
        } else {
            console.log("Preparing to save, do not exit")
        }
        base.timeout = setTimeout(()=>{
            fs.writeFile("data/"+filename, JSON.stringify(base.data), 'utf8', err=>console.error(err));
            console.log("Saved")
        }, 100);
    }
    let proxy = new Proxy(base, {
        set(self, key, val) {
            self.data[key] = val;
            self.save();
            return true;
        },
        get(self, key) {
            if (key[0] == "_") return self[key.substring(1)];
            if (key == "toJSON") return self.toJSON;
            if (typeof key == "symbol") return self[key]
            return (function getNest(obj, key){
                if (key == "toJSON") return obj.toJSON;
                if (typeof key == "symbol") {
                    if (key == Symbol.toPrimitive) return ()=>0;
                    return obj[key];
                }
                let got = obj[key];
                if (got == undefined) {
                    got = {};
                    obj[key] = got;
                    self.save();
                }
                if (typeof got == 'object') {
                    return new Proxy(got, {
                        set(obj, key, val) {
                            obj[key] = val;
                            self.save();
                            return true;
                        },
                        deleteProperty(obj, key) {
                            delete obj[key];
                            self.save();
                        },
                        get: getNest
                    });
                } else {
                    return got;
                }
            })(self.data, key);
        },
        ownKeys(self) {
            return Object.keys(self.data);
        },
        getOwnPropertyDescriptor(self, key) {
            return Object.getOwnPropertyDescriptor(self.data, key);
        },
        has(self, key) {
            return key in self.data;
        },
        deleteProperty(self, key) {
            delete self.data[key];
            self.save();
        }
    });
    existingProxies[filename] = proxy;
    return proxy;
}

module.exports = jsonProxy;