import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils';
import prisma from '@/util/prisma-client';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import NotLoggedIn from '@/components/NotLoggedIn';

async function verifyPhoneNumber (data: FormData) {
    "use server"

    const session = await getServerSession(authOptions);
    const phoneNumberArea = data.get("phoneNumberArea")?.valueOf();
    const phoneNumber3 = data.get("phoneNumber3")?.valueOf();
    const phoneNumber4 = data.get("phoneNumber4")?.valueOf();
    const smsConsentCheck = data.get("smsConsentCheck")?.valueOf();

    if(smsConsentCheck !== "on") {
        console.log("\"" + smsConsentCheck + "\" is an invalid value for the SMS Consent Checkbox");
        redirect("/verification/add-phone");
    }

    const phoneNumber = "+1" + phoneNumberArea + phoneNumber3 + phoneNumber4;
    const regex = /\+\d{11}/

    if (!!!regex.test(phoneNumber)) {
        console.log(phoneNumber + " does not match the proper phone number format");
        redirect("/verification/add-phone");
    }


    //inject phoneNumber into request
    var requestOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json", "Authorization": "Basic Njc2N2Q4NDQtYzRmNC00NzliLWI0NWYtYjNjN2ZlMWRhZGIyOmlOSm1EcGhJcjBlRW9hRzk4czhFU3c9PQ==", "Accept-Language": "en-US"},
            body: "{ \
            \"identity\": { \
            \"type\": \"number\", \
            \"endpoint\": \"" + phoneNumber + "\" \
            }, \
            \"method\": \"sms\" \
            }"
        };

    //send code to user
    fetch("https://verification.api.sinch.com/verification/v1/verifications", requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error))
        .then(redirect("/verification/" + phoneNumber + "/enter-code"));

}
    

export default async function AddPhone() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return(<NotLoggedIn message='Must be logged in to add a phone number to your account. After logging in to Animal Family, in order to add and verify your phone number for SMS messaging, you will be given the option to opt in to recieve text messages from Animal Family for the purpose of being notified when a task needs to be completed, as well as to recieve a text message for the purpose of verifying a valid phone number.'/>)
    }
    const email = session?.user?.email;
    const userInfo = await prisma.user.findFirst({where: {email: email}});

    return(
        <div className='w-screen m-auto flex flex-col justify-center items-center px-4'>
            {/* <p className='py-10 max-w-md text-center'>By entering and verifying your phone number for SMS messaging, you agree to send and receive SMS text messages at the phone number provided, through Animal Family.</p> */}
            <form action={verifyPhoneNumber} className=''>
                {userInfo?.phoneNumber ?
                    <div className='text-center pb-10 max-w-xs text-zinc-500'><span className='text-zinc-100 italic'>{userInfo.phoneNumber}</span> is already connected to your account.</div>
                :
                <div className='text-center pb-10 max-w-xs text-zinc-500'>You do not have a phone number connected, add one below:</div>
                }
                <div className='flex pb-10 justify-center'>
                    <label className='pr-2'>Phone Number: </label>
                    <div className='flex gap-2'>
                        <span>(</span><input className='rounded w-[3ch] text-zinc-900' maxLength={3} autoFocus required type='text' id='phoneNumberArea' name='phoneNumberArea' placeholder='777' pattern="[0-9]{3}"></input><span>)</span>
                        <input className='rounded w-[3ch] text-zinc-900' maxLength={3} required type='text' id='phoneNumber3' name='phoneNumber3' placeholder='123' pattern="[0-9]{3}"></input><span>-</span>
                        <input className='rounded w-[4ch] text-zinc-900' maxLength={4} required type='text' id='phoneNumber4' name='phoneNumber4' placeholder='4567' pattern="[0-9]{4}"></input>
                    </div>
                </div>
                <div className='max-w-sm gap-2 pb-10 text-center'>
                        <input type="checkbox" id='smsConsentCheck' name='smsConsentCheck' required></input>
                        <label htmlFor='smsConsentCheck'>Check this box to opt in to recieve text messages from Animal Family for the purpose of being notified when a task needs to be completed, as well as to recieve a text message for the purpose of verifying a valid phone number.</label>
                    </div>
                <div className="flex justify-evenly">
                    <Link href="/">Cancel</Link>
                    <button type="submit" className="px-2 rounded text-zinc-100 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">Verify Phone Number</button>
                </div>
            </form>
        </div>
    )
}