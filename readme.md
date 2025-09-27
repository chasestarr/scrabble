anagram method

direct-n: file contains words with length n
inverse-n: file contains words with length n reversed
used to check perpendiculars while checking the pricipal word
inverse is useful to quickly scan up/left

associated string: formed by letters of the word ordered alphabetically
preliminar aindex-n: file contains words from direct-n concatentated with associated string
aindex-n: file contains preliminar aindex-n with associated string characters replaced with potenial
blank tiles in every permutation
ordered aindex-n: sorts aindex-n members by associated string so that members with same associated
string are neighbors
reduced aindex-n: duplicated members are eliminated and classes are reduced by removing repeated
associated strings leaving the class representative
index-n: file contains associated string parts of class representatives. class represetative includes
a pointer to words in anagrams-n file
anagrams-n: file contains all of the words from the reduced aindex-n file
findAnagrams procedure: given a subrack, returns a pointer to the anagrams start and a count of
available anagrams
septets: file contains all possible strings of 7 letters to produce a 7 letter bingo. used when
board is clear.
septets9: file contains members - string of 7 tiles, sum of tiles, delta value that indicates if
the member can be placed on the board.

```
direct-7
ACABALO
===================
preliminar aindex-7
ACABALOAAABCLO
===================
aindex-7
ACABALOAAABCLO
ACABALO#AABCLO
ACABALOA#ABCLO
ACABALOAA#BCLO
ACABALOAAA#CLO
ACABALOAAAB#LO
ACABALOAAABC#O
ACABALOAAABCL#
...
ACABALO##ABCLO
ACABALO#A#BCLO
ACABALO#AA#CLO
...
ACABALOAAABC##
...
===================
ordered aindex-7
ACABALOAAABCLO
ACOLABAAAABCLO
ALOCABAAAABCLO
BACALAOAAABCLO
ACABALOAAABCL#
ACOLABAAAABCL#
...
===================
reduced aindex-7
ACABALOAAABCLO
ACOLABA
ALOCABA
BACALAO
ACABALOAAABCL#
ACOLABA
ALOCABA
BACALAO
===================
```

interval: collection of, more than one, consecutive unoccupied squares on the board that are not
next to (have distance greater than 1) an occupied square. either row or column
molecule: maximal collection of consecutive tiles that have one distance between them
halo: cells with manhattan distance 1 from all played tiles or H8 if empty board

calculating valid moves:
empty board:

- all rack combinations with cardinality > 1 are generated and ordered alphabetically
- look for rack combinations within index list
- if rack combination is found, find anagrams from index pointer

given a rack: {A, E, O, D, L, N, T} and empty board

- alphabetize to ADELNOT
- search for ADELNOT in index list
