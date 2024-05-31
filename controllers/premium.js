// const User = require('../models/users');
// const Expense=require('../models/expenses');

// exports.getPremium=async(req,res,next)=>{
//     try{
//         const users=await User.findAll()
//         const expenses=await Expense.findAll()
//         const userAggregatedExpenses={}
//         expenses.forEach((expense)=>{
//             if(userAggregatedExpenses[expense.userId]){
//                 userAggregatedExpenses[expense.userId] = userAggregatedExpenses[expense.userId] + expense.expenseamount
//             }else{
//                 userAggregatedExpenses[expense.userId]=expense.expenseamount
//             }
//         })
//         console.log(userAggregatedExpenses)
//         var userLeaderBoardDetails=[];
//         users.forEach((user)=>{
//             userLeaderBoardDetails.push({name:user.name,total_cost:(userAggregatedExpenses[user.id]||0)})

//         })
        
//         userLeaderBoardDetails.sort((a,b)=>b.total_cost-a.total_cost)
//         console.log(userLeaderBoardDetails)
//         res.status(200).json(userLeaderBoardDetails)

//     }catch(err){
//         console.log(err)
//         res.status(500).json(err)

//     }
// }














const User = require('../models/users');
const sequelize = require('../util/database');
const Expense = require('../models/expenses');

exports.getPremium = async (req, res, next) => {
    try {
        const leaderboardofusers = await User.findAll({
            attributes: ['id', 'name',[sequelize.fn('sum', sequelize.col('expenses.expenseamount')), 'total_cost'] ],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group:['user.id'],
            order:[['total_cost', 'DESC']]

        })
       
        res.status(200).json(leaderboardofusers)
        // Fetch all users and expenses asynchronously
        // const [users, expenses] = await Promise.all([User.findAll(), Expense.findAll()]);

        // // Create an object to aggregate expenses by user ID
        // const userAggregatedExpenses = {};

        // // Aggregate expenses for each user
        // expenses.forEach((expense) => {
        //     if (userAggregatedExpenses[expense.userId]) {
        //         userAggregatedExpenses[expense.userId] += expense.expenseamount;
        //     } else {
        //         userAggregatedExpenses[expense.userId] = expense.expenseamount;
        //     }
        // });

        // console.log(userAggregatedExpenses);

        // // Create an array to hold user leaderboard details
        // const userLeaderBoardDetails = users.map((user) => ({
        //     name: user.name,
        //     total_cost: userAggregatedExpenses[user.id] || 0
        // }));

        // // Sort the leaderboard details by total cost in descending order
        // userLeaderBoardDetails.sort((a, b) => b.total_cost - a.total_cost);

        // console.log(userLeaderBoardDetails);

        // // Send the sorted leaderboard details as a JSON response
        // res.status(200).json(userLeaderBoardDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching premium users' });
    }
};
