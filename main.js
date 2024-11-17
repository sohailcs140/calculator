const multiplication = (...args)=>{

    ans = 1

    args.forEach(elem=>{
        ans *= elem
    })

    return ans
}

console.log(multiplication(10, 2));
