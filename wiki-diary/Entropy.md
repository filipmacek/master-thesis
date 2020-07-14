### Definition
**Entropy** can mean different things depending on the context:

* [Computing](https://en.wikipedia.org/wiki/Entropy_(computing))
> In computing, entropy is the randomness collected by an operating system or application for use in cryptography or other uses that require random data.
> This randomness is often collected from hardware sources , either pre-existing ones such as mouse movements or specially provided randomness generators.

* [Information theory](https://en.wikipedia.org/wiki/Entropy_(information_theory))
> In information theory, entropy is a measure of the uncertainty associated with a random variable. The term by itself in this context usually refers to the Shannon entropy, which > quantifies, in the sense of expected value, the information contained in a message, usually in units such as bits. Equivalently, the Shannon entropy is a measure of the average  > information content one is missing when one does not know the value of the random variable.

### Linux
Linux kernel is using special algorithm "Pseudo number generator"(PRNG) for randomness and puts results in special files `/dev/random` and  `/dev/urandom`. 
It is highly acclaimed for produing reliable randomness and provides the sam security level that is used for the creation of cryptographic keys.
Difference between them is that `/dev/random` is blocking and will block any process until it retrieves some entropy which means it provides truly random numbers(at least what whe believe), while `/dev/urandom` provides 'merely' cryptographically-secure random numbers.
So it is advise to always use latter because of this.
