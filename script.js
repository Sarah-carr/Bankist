'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');




const displayMovements = function(movements, sort = false) {
containerMovements.innerHTML = "";  //similar to text content, difference is html returns everything inc html.

const movs = sort ? movements.slice().sort((a, b) => a - b) : movements

movs.forEach(function(mov, i) {
  const type = mov > 0 ? "deposit" : "withdrawal";

  //template literals are great for creating html templates
const html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
  </div>
        `;

        containerMovements.insertAdjacentHTML("afterbegin", html);

});
};


const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`
};



const calcDisplaySummary = function(acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${incomes}€`
  
    const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(out)}€`

  const interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit * acc.interestRate) /100)
  .filter((int, i, arr) => {
    return int >= 1;
  }) 
  .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = `${interest}€`
};



const createUsernames = function(accs) {
accs.forEach(function(acc) {
  acc.username = acc.owner
  .toLowerCase()
  .split(" ")
  .map(name => name[0])
  .join("");
});
};
createUsernames(accounts);
console.log(accounts);

const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

let currentAccount;

btnLogin.addEventListener("click", function(e) {
  e.preventDefault();
  
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if(currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});


btnTransfer.addEventListener("click", function(e) {
  e.preventDefault();

  const amount =  Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = "";

  if(amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function(e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount = "";
})

btnClose.addEventListener("click", function(e) {
  e.preventDefault();
 
  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function(e){
  e.preventDefault;
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES


//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////


//Arrays are the most used method. Methods are functions can call on objects. Arrays are objects. Array methods are functions attached to arrays.

/*
let arr = ["a", "b", "c", "d", "e"];

//slice
console.log(arr.slice(2)); //extract an element from any array without changing original array. Like strings. Returns a copy of arr with extracted parts. Starts position 2 (So C) to end
console.log(arr.slice(2, 4)); //starts at 2 ends at 3 as possition 4 isn't included
console.log(arr.slice(-2)); //starts from end. -1 is last element
console.log(arr.slice(1, -2));
console.log(arr.slice()); //shallow copy of the array. Only really need when chain methods together.

//splice - changes original array
// console.log(arr.splice(2)); //extracted elements are gone from the original array, mutates original array
arr.splice(-1); //common use case is to remove last item in an array
arr.splice(1, 2) //second item is the delete count, not the position
console.log(arr);

//reverse

let arrA = ["a", "b", "c", "d", "e"];
const arr2 = ["j","i", "h", "g", "f"];
console.log(arr2.reverse()); //mutates orignial array
console.log(arr2);

//concat - concatinate two arrays
const letters = arrA.concat(arr2);
console.log(letters);
console.log([...arrA, ...arr2]); //same as doing this

//Join
console.log(letters.join(" - ")); //creates string with specified separater 


//"at" method (also works on strings)
const arr = [23, 11, 64];
console.log(arr.at(0));
//same as doing console.log(arr(0));
//more useful because can do more with it such as find  end value more simply. If counting from end at is better, same if method chaining. If want to quickly get a value from the way like first element the brackets notation is fine.

//traditional ways of getting last element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);

//new "at" method to get last element
console.log(arr.at(-1));

console.log("Sarah".at(0));
console.log("Sarah".at(-1));


//looping arrays: forEach
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300]; //positive values deposits, negative are withdrawrals

//for(const movement of movements) {
for(const [i, movement] of movements.entries())  { //index first then current element
if(movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}

console.log("----- FOR EACH ----");
movements.forEach(function(mov, i, arr) { //order matters: first = current element, second = current index, third = entire array looping over
  if(mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
  }
})
// at itteration 0 it calls the function with the value of the current position of movement

//cannot break out of forEach loop so continue and break statements don't work, will always loop over entire array. If need to break out of a loop need to use for of loop. Other than that it's preferences.


//forEach with Maps and Sets

//Map
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);


currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
})

//Set

const currenciesUnique = new Set(["USD", "GBP", "USD", "EUR", "EUR"]);
console.log(currenciesUnique);
currenciesUnique.forEach(function(value, key, map) {
  console.log(`${key}: ${value}`); //key and value show the same as the set doesn't have keys eg would really be (value, value, map)
})

//using an underscore means a throwaway value


//map, filter, reduce

//map - similar to for each but creates new array based on original array. Applies callback function to element and puts it into a new array. More useful than forEach. More in line with functional programming. For each prints each element as a new line (side effects), map returns strings into an array.

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;

// const movementsUSD = movements.map(function(mov) {
//   return mov * eurToUsd
// });

//CAN BE SIMPLIFIED AS ARROW FUNCTION

const movementsUSD = movements.map(mov => mov * eurToUsd);

console.log(movements);
console.log(movementsUSD);

//SAME OUTPUT AS

const movementsUSDfor = [];
for(const mov of movements) movementsUSDfor.push(mov * eurToUsd);
console.log(movementsUSDfor);


const movementsDescriptions = movements.map((mov, i) => 
  `Movement ${i + 1}: You ${mov > 0 ? "deposited" : "withdrew"} ${Math.abs(mov)}`
);
console.log(movementsDescriptions);


//filter - used to filter for elements in an array that meet a criteria and put them into a new array.

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(function(mov) {
return  mov > 0
})
console.log(movements);
console.log(deposits);

const depositsFor = []
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);


//reduce - reduce elements of original array to one value eg add them all together. Need accumulator variable

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// acc = accumulator, the value everything is added to to create the final value (like a snowball)
// const balance = movements.reduce(function(acc, cur, i, arr) {
//  console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0); //initial value of the accumulator, where it starts
const balance = movements.reduce((acc, cur) => acc + cur, 0);
console.log(balance); 



let balance2 = 0;
for(const mov of movements) balance2 += mov;
console.log(balance2);


//maximum value of movements array
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const max = movements.reduce((acc, mov) => {
  if (acc > mov)
  return acc;
  else 
  return mov;
}, movements[0])
console.log(max);


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1;

// there is an order, need to return array values first, finally reduce which returns a value
const totalDepositsUSD = movements
.filter(mov => mov > 0)
//.map(mov => mov * eurToUsd)
.map((mov, i, arr) => {
  // console.log(arr);
  return mov * eurToUsd;
})
.reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUSD);


//the find method - returns boolean, like filter but doesn't return new array, only returns first item in the array that fits the criteria
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === "Jessica Davis");
console.log(account);


//some and every methods
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//checks for equality
console.log(movements.includes(-130));

//checks using a condition
const anyDeposits = movements.some(mov => mov  > 0);
console.log(anyDeposits);

//every
console.log(movements.every(mov => mov  > 0));

//separate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));


//flat and flatMap - flat only goes one level deep
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

// can set depth of nesting
const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// const allMovemements = accountMovements.flat();
// console.log(allMovemements);
// const overallBalance = allMovemements.reduce((acc,mov) => acc + mov, 0);
// console.log(overallBalance);

//flat
const overallBalance = accounts.map(acc => acc.movements).flat().reduce((acc,mov) => acc + mov, 0);
console.log(overallBalance);

//flatMap - can only go one level deep
const overallBalance2 = accounts.flatMap(acc => acc.movements).reduce((acc,mov) => acc + mov, 0);
console.log(overallBalance2);


//sort - mutates original array. Based on strings, doesn't work with numbers, converts to strings first
const owners = ["Jonas", "Zach", "Adam", "Martha"];
console.log(owners.sort());

//numbers
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//return < 0, A, B (keep order)
// return > 0, B, A (switch order)

//ascending
// movements.sort((a, b) => {
// if (a > b)
// return 1;
// if (b > a)
// return -1;
// });
movements.sort((a,b) => a - b);
console.log(movements);

//decending
movements.sort((a, b) => {
  if (a > b)
  return -1;
  if (b > a)
  return 1;
  });
movements.sort((a, b) => b - a);
console.log(movements);


//creating and filling arrays
const arr = [1, 2, 3, 4, 5, 6, 7];
const x = new Array (7); //when there is only one number it creates an array with seven elements with nothing in them

x.fill(1); //this fills the array with 1s
console.log(x);

x.fill(1, 3, 5); //like slice the second value is the start position. Can also add a third value for end position
console.log(x);

arr.fill(23, 2, 6); //like slice the second value is the start position
console.log(arr);

const y = Array.from({length: 7}, () => 1);
console.log(y);

const z = Array.from({length: 7}, (_, i) => i + 1)
console.log(z);

labelBalance.addEventListener("click", function(){
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace("€", ""))
);
console.log(movementsUI);

const movementsUI2 = [...document.querySelectorAll(".movements__value")];
  });



//when to use each Array method (studied 23 to date)
Ask question "what do I want"

To mutate original array
- Add to original:
    .push (end)
    .unshift (start)
- Remove from original:
    .pop (end)
    .shift (start)
    .splice (any)
- Others
    .reverse
    .sort
    .fill

A new array
- Computed from original
    .map (loop)
- Filtered using condition
    .filter
- Portion of original
   .slice
- Adding original to another
    .concat
- Flattening the original
    .flat
    .flatMap

An array index
- Based on value
    .indexOf
- Based on test condition
    .findIndex  

know if an array includes (boolean)
- Based on value
    .includes
- Based on test condition
    .some
    .every

An array element
- Based on test condition
    .find

A new string
- Based on separator string
    .join

To transform a value
- Based on accumulator
    .reduce (boil down array to single value of any type)

to just loop array
- Based on callback
    .forEach (does not create a new array, just loops over it)



//1.
const bankDepositSum = accounts
.flatMap(acc => acc.movements)
.filter( mov => mov > 0)
.reduce((sum, cur) => sum + cur, 0);

console.log(bankDepositSum);


//2.
const numDeposits1000 = accounts
.flatMap(acc => acc.movements)
// .filter(mov => mov > 1000)
// .length;
//.reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0)
.reduce((count, cur) => (cur >= 1000 ? ++count : count), 0) //the ++ doesn't work after the value (se below), needs to be before
console.log(numDeposits1000);

let a = 10;
console.log(a++); // = 10 as increments value but logs previous value

//3.
const {deposits, withdrawals} = accounts
.flatMap(acc => acc.movements)
.reduce((sums, cur) => {
// cur > 0 ? sums.deposits += cur : sums.withdrawals += cur;
sums[cur > 0 ? "deposits" : "withdrawals"] += cur;
return sums;
}, {deposits: 0, withdrawals: 0})

console.log(deposits, withdrawals);

//4.
const convertTitleCase = function (title) {
  const capitalise = str => str[0].toUpperCase() + str.slice(1);

const exceptions = ["a", "an", "the", "but", "or", "on", "in", "with", "is", "and"];

const titleCase = title.toLowerCase().split(" ").map(word => exceptions.includes(word) ? word : capitalise(word)).join(" ");
return capitalise(titleCase)
}
console.log(convertTitleCase("this is a nice title"));
console.log(convertTitleCase("this is a LONG title, but not too long"));
console.log(convertTitleCase("and this is another title with an EXAMPLE"));
*/