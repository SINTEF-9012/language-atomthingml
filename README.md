#ThingML IDE in Atom!

![ThingML Atom Editor](https://github.com/SINTEF-9012/language-atomthingml/blob/master/docs/screenshot.png?raw=true "ThingML Atom Editor")


A simple IDE for ThingML. To be used by power users only! Beginners are invited to use the Eclipse plugins and follow the indications available on [ThingML's Github](https://github.com/SINTEF-9012/ThingML).

Note that this Atom grammar is both more and less restrictive than the actual ThingML grammar, but it will improve over time

Some limitations:
- it helps to have two blank lines between functions, transitions, states, etc
- ThingML expressions within extern expressions might not be properly parsed, though it should not be blocking
