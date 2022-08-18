// function knapsack(weights, distances, W) {
//   const n = weights.length
//   const dp = new Array(n + 1).fill().map(() => new Array(W + 1).fill(0))

//   for (let i = 1; i < dp.length; i++) {
//     for (let j = 0; j < dp[i].length; j++) {
//       if (j - weights[i - 1] >= 0) {
//         const distance = distances[i - 1] + (dp[i - 1][j - weights[i - 1]] || 0)
//         dp[i][j] = Math.max(distance, dp[i - 1][j])
//       } else {
//         dp[i][j] = dp[i - 1][j] || 0
//       }
//     }
//   }

//   return dp[weights.length][W]
// }

// weights = [5, 3, 4, 2]
// distances = [60, 50, 70, 30]
// W = 5
// console.log(knapsack(weights, distances, W))


function knapsack(weights, values, W){
    var n = weights.length;
    var f = new Array(n)
    // set 2d array
    for(var i = 0 ; i < n; i++){
        f[i] = []
    }
   for(var i = 0; i < n; i++ ){
       for(var j = 0; j <= W; j++){
            if(i === 0){ //第一行
                f[i][j] = j < weights[i] ? 0 : values[i]
            }else{
                if(j < weights[i]){ //等于之前的最优值
                    f[i][j] = f[i-1][j]
                }else{
                    f[i][j] = Math.min(f[i-1][j], f[i-1][j-weights[i]] + values[i]) 
                }
            }
        }
    }
    return f[n-1][W]
}

var a = knapsack([2,2,6,5,4],[6,3,5,4,6],10)
console.log(a)