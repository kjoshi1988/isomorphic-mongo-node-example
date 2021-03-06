# About

**An Iso-Morphic react example with mongodb.**

## Table of contents

* [Requirements](#requirements)
* [How To Run](#how-to-run) How to run.
* [License](#license) (The MIT License)

## Requirements

```
 1. NodeJs, version >= 6
 2. MongoDb, version >= 3.2.7
```

## How To Run

Follow below instructions to run the app:

```
  1. npm install
  2. npm install gulp -g
  3. gulp setup-db   //this will start mongo as well as build schema in test db
  4. gulp bundle     //bundle app.js, to provide iso-morphic support
  5. node app.js     //this will start app, before hitting the below url, wait for Server started message. 
  6. visit http://localhost:8080/
```

## License

The MIT License (MIT)

Copyright (c) 2016 Kapil Joshi  <<kjoshi1988@gmail.com>>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.