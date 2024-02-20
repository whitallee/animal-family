import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils';
import prisma from '@/util/prisma-client';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function verifyCode (data: FormData) {
    "use server"

    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    const verificationCode = data.get("verificationCode")?.valueOf();
    const phoneNumber = data.get("phoneNumber")?.valueOf();

    if (email == null) {
        console.log("User Email not valid");
        redirect("/");
    }

    if (typeof(phoneNumber) !== "string") {
        console.log("Type error on Phone - " + phoneNumber + ": " + typeof(phoneNumber));
        redirect("/verification/add-phone")
    }

    if (typeof(verificationCode) !== "string") {
        console.log("Type error on Code - " + verificationCode + ": " + typeof(verificationCode));
        redirect("/verification/" + phoneNumber + "/enter-code")
    }

    const regex = /\d{4}/
    if (!!!regex.test(verificationCode)) {
        console.log(verificationCode + " does not match the proper code format");
        redirect("/verification/" + phoneNumber + "/enter-code");
    }
//this is what was copied ^^^

//this is what will take the verification code that has been sent vvv

var requestOptions = {
        method: 'PUT',
        headers: { "Content-Type": "application/json", "Authorization": "Basic Njc2N2Q4NDQtYzRmNC00NzliLWI0NWYtYjNjN2ZlMWRhZGIyOmlOSm1EcGhJcjBlRW9hRzk4czhFU3c9PQ==" },
        body: "{ \"method\": \"sms\", \"sms\":{ \"code\": \""+ verificationCode + "\" }}"
    };
const verificationURL = "https://verification.api.sinch.com/verification/v1/verifications/number/" + phoneNumber;
let res: any;
await fetch(verificationURL, requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result);
        res = result
    })
    .catch(error => console.log('error', error));

if (res !== undefined && res.status === 'SUCCESSFUL') {
    await prisma.user.update({
        data: {
            phoneNumber: phoneNumber
        },
        where: {
            email: email
        }
    });
}

const phoneTest = await prisma.user.findFirst({
    where: {
        email: email
    }
})
if (!phoneTest?.phoneNumber) {
    console.log("Phone Number not successfully entered");
    redirect("/");
}

redirect("/verification/" + phoneNumber + "/success");
}

    

export default async function AddPhone({params: { phoneNumber }}: {params: {phoneNumber: string}}) {
    const session = getServerSession(authOptions);

    return(
        <div className='w-screen m-auto flex justify-center'>
            <form action={verifyCode}>
                <div className='flex pb-10'>
                    <label htmlFor='verificationCode' className='pr-2'>Enter 4 Digit Code sent to your Phone Number: </label>
                    <input className='rounded w-[4ch] text-zinc-900' maxLength={4} required type='text' id='verificationCode' name='verificationCode' placeholder='1234' pattern="[0-9]{4}"></input>
                    <input type='hidden' value={decodeURIComponent(phoneNumber)} id='phoneNumber' name='phoneNumber'></input>
                </div>
                <div className="flex justify-evenly">
                    <Link href="/">Cancel</Link>
                    <button type="submit" className="px-2 rounded text-zinc-100 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">Verify Phone Number</button>
                </div>
            </form>
        </div>
    )
}