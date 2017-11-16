
(function (f) {
    if (typeof module === 'object' && typeof module.exports === 'object'){
        module.exports = f();
    }
    else{
        window.Promise = f();
    }
})(function () {
    if(typeof Promise != 'function'){
        var Promise = function(fn) {
            var state = 'pending';
            var callbacks = [];
            var result = null;
            function res_rej(a,b,c) {
                if(state !== 'pending'){
                    return;
                }
                if(b && b['then'] && typeof b['then'] === 'function'){
                    b['then'](resolve, reject);
                    return;
                }
                state = a;
                result = b;
                callbacks.forEach(function (obj) {
                    obj[c](result);
                });
            }
            function resolve(value) {
                res_rej('fulfilled',value,0);
            }
            function reject(reason) {
                res_rej('rejected',reason,1);
            }
            this.then = function (onFulfilled,onRejected) {
                return new Promise(function (resolve, reject) {
                    switch (state){
                        case 'pending':
                            callbacks.push([
                                function () {
                                    resolve(onFulfilled(result));
                                },
                                function () {
                                    reject(onRejected(result));
                                }
                            ]);
                            break;
                        case 'fulfilled':
                            resolve(onFulfilled(result));
                            break;
                        case 'rejected':
                            reject(onRejected(result));
                            break;
                    }
                });
            };
            this.catch = function (onRejected) {
                return this.then(null, onRejected);
            };
            fn(resolve,reject);
        };
        Promise.resolve = function (value) {
            return new Promise(function(resolve) {
                resolve(value);
            });
        };
        Promise.reject = function (reason) {
            return new Promise(function(resolve, reject) {
                reject(reason);
            });
        };
        Promise.all = function (promises) {
            return new Promise(function(resolve, reject) {
                var count = 0;
                var values = [];
                for (var i = 0; i < promises.length; i++) {
                    Promise.resolve(promises[i]).then(function(value) {
                        values.push(value);
                        if (count === promises.length-1) {
                            resolve(values);
                        }
                        else{
                            count++;
                        }
                    }, function(reason) {
                        reject(reason);
                    });
                }
            });
        };
        Promise.race = function (promises) {
            return new Promise(function(resolve, reject) {
                for (var i = 0; i < promises.length; i++) {
                    Promise.resolve(promises[i]).then(function(value) {
                        resolve(value);
                    }, function(reason) {
                        reject(reason);
                    })
                }
            });
        };
    }
    return Promise;
});
