# language-atomthingml
Atom grammar for ThingML


A simple grammar for ThingML. To be used by power users only! Beginners are invited to use the Eclipse plugins and follow the indications available on [ThingML's Github](https://github.com/SINTEF-9012/ThingML).

Note that this Atom grammar is both more and less restrictive than the actual ThingML grammar. The goal is to make, over time, the Atom grammar as close as possible to the actual ThingML grammar to avoid false positive/negative.

Some limitations:
- you cannot call the compilers, yet. A settings meny will be provided to allow you to point to the ThingML jar or to a ThingML server providing fully-fledged parser and compilers as a service
- it helps to have two blank lines between functions, transitions, etc
- ThingML expressions within extern expressions might not be properly parsed, though it should not be blocking
