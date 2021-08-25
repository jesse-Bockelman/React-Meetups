import { Fragment } from "react";
import MeetupDetail from '../components/meetups/MeetupDetail';
import {MongoClient, ObjectId} from 'mongodb';
import Head from "next/head";

function MeetupDetails(props){
    return(
        <Fragment>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta name="description" content={props.meetupData.description} />
            </Head>
            <MeetupDetail image={props.meetupData.image} title={props.meetupData.title} address={props.meetupData.address} 
            description={props.meetupData.description}/>
        </Fragment>
    );
};

export async function getStaticPaths(){

    const client = await MongoClient.connect('mongodb+srv://Jesse:Xzelnaga1!@cluster0.h9zwx.mongodb.net/meetups?retryWrites=true&w=majority');
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection.find({},{_id:1}).toArray();
    client.close();
    return {
        fallback: 'blocking',
        paths:meetups.map(meetup=>({
            params:{meetupID:meetup._id.toString()}
        }))
    };
}

export async function getStaticProps(context){
    //fetch data for a single meetup
    const meetupID = context.params.meetupID;
    const client = await MongoClient.connect('mongodb+srv://Jesse:Xzelnaga1!@cluster0.h9zwx.mongodb.net/meetups?retryWrites=true&w=majority');
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const selectedMeetup = await meetupsCollection.findOne({_id:ObjectId(meetupID)});
    client.close();
    return{
        props:{
            meetupData:{
                id:selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                address:selectedMeetup.address,
                description:selectedMeetup.description,
                image:selectedMeetup.image
            }
        }
    };
}

export default MeetupDetails;