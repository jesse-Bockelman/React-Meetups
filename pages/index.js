import MeetupList from '../components/meetups/MeetupList';
import {MongoClient} from 'mongodb';
import Head from 'next/head';
import { Fragment } from 'react';

/* const DUMMY_MEETUPS = [
    {
        id:'m1', 
        title:'A First Meetup', 
        image:'https://insiderguides.com.au/wp-content/uploads/2016/12/Melbourne_Transport_Insider_Guides-2-768x512.jpg',
        address:'Some Address 5, 12345, Some City',
        description:'This is a First meetup!'
    },
    {
        id:'m2', 
        title:'A Second Meetup', 
        image:'https://insiderguides.com.au/wp-content/uploads/2016/12/Melbourne_Transport_Insider_Guides-2-768x512.jpg',
        address:'Some Address 125, 12345, Some New City',
        description:'This is a Second meetup!'
    },
] */

function HomePage(props){
    return(
        <Fragment>
            <Head>
                <title>React Meetups</title>
                <meta name="description" content="Browse a huge list of highly active React meetups!" />
            </Head>
            <MeetupList meetups={props.meetups} />
        </Fragment>
    );
};

export async function getStaticProps(){
    // fetch data from an API
    const client = await MongoClient.connect('mongodb+srv://Jesse:Xzelnaga1!@cluster0.h9zwx.mongodb.net/meetups?retryWrites=true&w=majority');
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection.find().toArray();
    client.close();
    return{
        props:{
            meetups:meetups.map(meetup=>({
                title:meetup.title,
                address:meetup.address,
                image:meetup.image,
                id:meetup._id.toString()
            }))
        },
        revalidate:10
    };
}

/* export async function getServerSideProps(context){
    const req = context.req;
    const res = context.res;
    //fetch data from an API
    return{
        props:{
            meetups: DUMMY_MEETUPS
        },
    };
} */

export default HomePage;