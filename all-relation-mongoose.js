
const express = require("express");
const app = express();
const mongoose = require("mongoose")
const DBconnection = require("./config/db")
DBconnection()

// now creating the schema 
// One-to-One: User has one Profile

const userSchema = new mongoose.Schema({
    name:{
        type: String
    },
    profile:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    }
})

const profileSchema = new mongoose.Schema({
    bio:{
        type: String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})


    // One-to-Many: User has many Post

    const postSchema = new mongoose.Schema({
        title:{
            type: String
        },
        content:{
            type: String
        },
        author:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    })

    // Many-to-Many: Students enrolls in many Courses,..
    //... Course has many Students

    const studentSchema = new mongoose.Schema({
        name:{
            type: String,
        },
        courses:[
            { type: mongoose.Schema.Types.ObjectId,ref: "Course" }
            ]   //Many-To-Many
    })
    
    const courseSchema = new mongoose.Schema({
        title:{
            type: String,
        },
        students:[
            {type: mongoose.Schema.Types.ObjectId, ref:"Student"}
        ] // Many-To-Many
    })

    // Creating models 

    const User = mongoose.model("User", userSchema)
    const Profile = mongoose.model("Profile", profileSchema)
    const Post = mongoose.model("Post", postSchema)
    const Student = mongoose.model("Student", studentSchema)
    const Course = mongoose.model("Course", courseSchema)

app.get("/create", async (req, res)=>{
    try {
        
        await User.deleteMany({})
        await Profile.deleteMany({})
        await Student.deleteMany({})
        await Course.deleteMany({})

        const user = new User({name: "John Doe"})
        const profile = new Profile({bio:"I love Coding! ",
            user: user._id
        })
        user.profile = profile._id

        await user.save()
        await profile.save()

    const findUser = await User.find().populate("profile")
    const findProfile = await Profile.find().populate("user")
        // console.log(findUser)


// One-to-Many: Create Posts for the user

            // Creating one post
        const post1 = new Post({
            title:"First Post",
            content:"This is my first post",
            author: user._id
        })
            // Creating second post
        const post2 = new Post({
            title:"Second Post",
            content:"This is my second post",
            author: user._id
        })

        // Saved here
        await post1.save()
        await post2.save()

// here I add whole array of posts in allPosts
        const allPosts =  await Post.find()

// because of populate method don't work on an array..
// it works only single element so I use for each loop ..
// to populate the element which is an object of posts


    //    allPosts.forEach(async (ele)=>{
    //         console.log(await ele.populate("author"))
    //     })

        
// Many-to-Many: Create Students and Courses 

    // creating student
    const student1 = new Student({
        name: "Alice"
    });
    const student2  = new Student({
        name:"Bob"
    });

    // creating courses
    const course1 = new Course({
        title:"Math"
    });

    const course2 = new Course({
        title: "Science"
    });

    // Pushing courses or coursers-id in the student1 and student2

    student1.courses.push(course1._id, course2._id);

    student2.courses.push(course1._id)

    // Pushing students or students-id in the course1 and course2

    course1.students.push(student1._id, student2._id)
    course2.students.push(student1._id)

    await student1.save();
    await student2.save();
    await course1.save();
    await course2.save();

    const course = await Course.findOne({title:"Math"}).populate("students")
    const student = await Student.findOne({name:"Alice"}).populate("courses")
    
    // console.log("Students in Math Course: ", )
    // console.log("Course taken by Alice: ", )

            // res.send(course)
            res.send(student)

        } catch (error) {
            console.error(error.message)
            res.send(error.message)
        }
    })


app.listen(3000, ()=>console.log("Server is running on port no. 3000"))