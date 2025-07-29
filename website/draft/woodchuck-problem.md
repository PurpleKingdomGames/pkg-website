
How much wood could a woodchuck chuck
If a woodchuck could chuck wood?
As much wood as a woodchuck could chuck,
If a woodchuck could chuck wood.
Unless the wood being chucked was already chucked,
By a woodchuck who chucked the wood.

A race condition problem in Elm, where the wood is immutable and both woodchucks chucked the same wood because they were unaware of each other and the model said there was enough wood to chuck.

Solutions:

1. Event base coordination, reserving the wood, fiddly implementation, many checks and balances.
2. State monad, recreating the trivial implementation you'd get with mutable programming, at the cost of passing around the forest.
3. The physics engine approach, all woodchuck components are updated and then the woodchuck manager checks they're in a valid state.