/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useEffect, useState, useMemo } from 'react';
import { Signer, UserData, Balance } from '@waves/signer';
import { networkByChainID } from './constants';
import { getActualAmount } from './utils';

interface HomeProps {
    signer: Signer;
    chainId: number;
}

const Home: React.FC<HomeProps> = ({ signer, chainId }) => {
    const [userData, setUserData] = useState<UserData>();
    const [balances, setBalances] = useState<Balance[] | null>(null);

    useEffect(() => {
        if (signer.currentProvider?.user)
            setUserData(signer.currentProvider.user);
    }, [signer]);

    return !userData ? (
        <div>
            <h1>Login</h1>
            <button
                onClick={() => {
                    signer.login().then((data: UserData) => setUserData(data));
                }}
            >
                Login
            </button>
        </div>
    ) : (
        <div>
            <div>
                <h1>User Data</h1>
                <p>
                    <label>Address ({networkByChainID[chainId]}):</label>
                    <span>{userData.address}</span>
                </p>
                <p>
                    <label>Public Key:</label>
                    <span>{userData.publicKey}</span>
                </p>
                <button
                    onClick={() => {
                        signer
                            .getBalance()
                            .then((data) => {
                                console.log('balance', data);

                                setBalances(data);
                            })
                            .catch(console.error);
                    }}
                >
                    Fetch Balances
                </button>
                <p>Navigate to console tab for more details</p>
                {balances ? (
                    <div>
                        <h3>Balances:</h3>
                        {balances.map((bal, idx) => (
                            <p key={idx}>
                                {getActualAmount(
                                    bal.amount.toString(),
                                    bal.decimals
                                )}{' '}
                                {bal.assetName}
                            </p>
                        ))}
                    </div>
                ) : (
                    <p>No available balances</p>
                )}
            </div>
            <div>
                <h2>Sign Set Asset Script</h2>
                <button
                    onClick={() => {
                        signer
                            .setAssetScript({
                                assetId:
                                    '9FKPH2PVQXpe8cuHHJkMKJMxdCmFZrPZftZTkPzhYXtj',
                                script: '12345678',
                            })
                            .broadcast();
                    }}
                >
                    Set asset script
                </button>
            </div>

            <div>
                <h2>Sign Burn</h2>
                <button
                    onClick={() => {
                        signer
                            .burn({
                                assetId:
                                    '9FKPH2PVQXpe8cuHHJkMKJMxdCmFZrPZftZTkPzhYXtj',
                                amount: 1,
                            })
                            .broadcast();
                    }}
                >
                    Burn
                </button>
            </div>

            <div>
                <h2>Sign Issue</h2>
                <button
                    onClick={() => {
                        signer
                            .issue({
                                name: 'Name of Token',
                                decimals: 2,
                                quantity: 1000,
                                reissuable: false,
                                description: 'Description of token',
                                script:
                                    'base64:AAIDAAAAAAAAAAQIARIAAAAAAAAAAAEAAAABaQEAAAADZm9vAAAAAAkBAAAACFdyaXRlU2V0AAAAAQUAAAADbmlsAAAAACvwfcA=',
                            })
                            .broadcast();
                    }}
                >
                    Sign issue
                </button>
            </div>

            <div>
                <h2>Sign massTransfer</h2>
                <button
                    onClick={() => {
                        signer
                            .massTransfer({
                                assetId:
                                    'BC2RVCn2NzoWM8s5MVr2Tns9EmcxL6guMgnDWy3Uj8nA',
                                transfers: [
                                    {
                                        amount: 10,
                                        recipient: 'merry',
                                    },
                                    {
                                        amount: 20,
                                        recipient:
                                            '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
                                    },
                                ],
                                attachment: '72k1xXWG59fYdzSNoA',
                            })
                            .broadcast();
                    }}
                >
                    massTransfer
                </button>
            </div>

            <div>
                <h2>Transfer 0.1 Tether USD Waves to Merry</h2>
                <div>
                    <button
                        onClick={() => {
                            signer
                                .transfer({
                                    amount: 100000,
                                    assetId:
                                        '5Sh9KghfkZyhjwuodovDhB6PghDUGBHiAPZ4MkrPgKtX',
                                    recipient: 'merry',
                                    attachment: null,
                                })
                                .broadcast();
                        }}
                    >
                        Basic
                    </button>
                </div>

                <div>
                    <button
                        onClick={() => {
                            signer
                                .transfer({
                                    amount: 10000000,
                                    recipient: 'merry',
                                    feeAssetId: 'WAVES',
                                    attachment: null,
                                })
                                .broadcast();
                        }}
                    >
                        With custom Fee feeAssetId
                    </button>
                </div>

                <div>
                    <button
                        onClick={() => {
                            signer
                                .transfer({
                                    amount: 10000000,
                                    recipient:
                                        '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
                                    attachment: null,
                                    fee: 676767,
                                })
                                .broadcast();
                        }}
                    >
                        With custom Fee amount
                    </button>
                </div>

                <div>
                    <button
                        onClick={() => {
                            signer
                                .transfer({
                                    amount: 10000000,
                                    recipient:
                                        '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
                                    attachment: '72k1xXWG59fYdzSNoA',
                                })
                                .broadcast();
                        }}
                    >
                        By address With attachment
                    </button>
                </div>
            </div>

            <div>
                <h2>Invoke</h2>
                <button
                    onClick={() => {
                        signer
                            .invoke({
                                dApp: 'alias:T:merry',
                                payment: [{ assetId: 'WAVES', amount: 1 }],
                                call: {
                                    function: 'test',
                                    args: [
                                        { type: 'string', value: 'string' },
                                        { type: 'integer', value: 123123123 },
                                        { type: 'boolean', value: true },
                                        {
                                            type: 'binary',
                                            value:
                                                'base64:AAIDAAAAAAAAAAQIARIAAAAAAAAAAAEAAAABaQEAAAADZm9vAAAAAAkBAAAACFdyaXRlU2V0AAAAAQUAAAADbmlsAAAAACvwfcA=',
                                        },
                                    ],
                                },
                                fee: 1000,
                            })
                            .broadcast();
                    }}
                >
                    Invoke
                </button>
            </div>

            <div>
                <h2>Data</h2>
                <button
                    onClick={() => {
                        signer
                            .data({
                                data: [
                                    {
                                        key: 'key1',
                                        value: 'world',
                                        type: 'string',
                                    },
                                    {
                                        key: 'key2',
                                        value: 'world',
                                        type: 'string',
                                    },
                                    {
                                        key: 'key3',
                                        value: 'world',
                                        type: 'string',
                                    },
                                    {
                                        key: 'AAAAAAAAAAAEAAAABaQEAAAADZm9v',
                                        value: 'world',
                                        type: 'string',
                                    },
                                    {
                                        key: 'key4',
                                        value: 123123123,
                                        type: 'integer',
                                    },
                                    {
                                        key: 'key5',
                                        value: true,
                                        type: 'boolean',
                                    },
                                ],
                            })
                            .broadcast();
                    }}
                >
                    Data
                </button>
            </div>

            <div>
                <h2>Sign Message</h2>
                <button
                    onClick={() => {
                        signer.signMessage(
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et lacinia augue. Nulla eu diam orci. Suspendisse dapibus porttitor tellus id mattis. Phasellus vitae condimentum justo. Maecenas et ultricies libero. Donec vitae lacus lectus. Cras sem felis, pretium sed lacinia ac, congue quis ipsum. Etiam eget auctor sapien, vel accumsan nisi. Aenean ac risus sit amet nulla lacinia ullamcorper ut ac nunc. Suspendisse potenti. Donec dolor diam, hendrerit in ligula cursus, vestibulum tristique mauris. Vestibulum vitae congue risus, quis placerat est.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et lacinia augue. Nulla eu diam orci. Suspendisse dapibus porttitor tellus id mattis. Phasellus vitae condimentum justo. Maecenas et ultricies libero. Donec vitae lacus lectus. Cras sem felis, pretium sed lacinia ac, congue quis ipsum. Etiam eget auctor sapien, vel accumsan nisi. Aenean ac risus sit amet nulla lacinia ullamcorper ut ac nunc. Suspendisse potenti. Donec dolor diam, hendrerit in ligula cursus, vestibulum tristique mauris. Vestibulum vitae congue risus, quis placerat est.'
                        );
                    }}
                >
                    Sign Lorem ipsum dolor sit amet...
                </button>
            </div>

            {/* <div>
                <h2>Sign Message2</h2>
                <div style={{
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    width: '200px',
                    display: 'inline-block'
                }}>Token: { token }</div>
                <div>
                <button
                    onClick={() => testSignMessage(signer, setToken)}
                >
                    Get token
                </button>
                </div>
            </div> */}

            <div>
                <h2>Sign Data</h2>
                <button
                    onClick={() => {
                        signer.signTypedData([
                            {
                                key: 'BackChat',
                                value: 'base64:BzWHaQUaGVsd29AAAAAAAA',
                                type: 'string',
                            },
                            {
                                key: 'CallingAllGirls',
                                value: 'false',
                                type: 'string',
                            },
                            { key: 'Jealousy', value: 'world', type: 'string' },
                            {
                                key: 'AAAAAAAAAAAEAAAABaQEAAAADZm9v',
                                value: 'Oh Waves, Waves!',
                                type: 'string',
                            },
                            { key: 'key', value: 123123123, type: 'integer' },
                            { key: 'key', value: true, type: 'boolean' },
                        ]);
                    }}
                >
                    Sign Data
                </button>
            </div>

            <div>
                <h2>Lease</h2>
                <button
                    onClick={() => {
                        signer
                            .lease({
                                amount: 677728840,
                                recipient:
                                    '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
                            })
                            .broadcast();
                    }}
                >
                    Lease
                </button>
                <button
                    onClick={() => {
                        signer
                            .lease({
                                amount: 677728840,
                                recipient: 'alias:T:merry',
                            })
                            .broadcast();
                    }}
                >
                    Lease to Merry by alias
                </button>
            </div>

            <div>
                <h2>Sponsorship</h2>
                <button
                    onClick={() => {
                        signer
                            .sponsorship({
                                assetId:
                                    '8BrF9fVo2tDPGMdcx91EdTZLmwUDX7K7h1zs6txCpAAA',
                                minSponsoredAssetFee: 123,
                            })
                            .broadcast();
                    }}
                >
                    Sign Sponsorship Enable
                </button>

                <button
                    onClick={() => {
                        signer
                            .sponsorship({
                                assetId:
                                    '8BrF9fVo2tDPGMdcx91EdTZLmwUDX7K7h1zs6txCpAAA',
                                minSponsoredAssetFee: 0,
                            })
                            .broadcast();
                    }}
                >
                    Sign Sponsorship Disable
                </button>
            </div>

            <div>
                <h2>Cancel Lease</h2>
                <button
                    onClick={() => {
                        signer
                            .cancelLease({
                                leaseId:
                                    'FUQasynBUELMXc9T1hrphfFwJvU2ENBiUfnJPci7jq4w',
                            })
                            .broadcast();
                    }}
                >
                    Cancel Lease
                </button>
            </div>

            <div>
                <h2>Alias</h2>
                <button
                    onClick={() => {
                        signer.alias({ alias: 'new_alias' }).broadcast();
                    }}
                >
                    Sign Alias
                </button>
            </div>

            <div>
                <h2>Reissue</h2>
                <button
                    onClick={() => {
                        signer
                            .reissue({
                                assetId:
                                    '6RHh59Tbt17QPvgaEu79DQsC5XyTqhBzpfB2FLV59ABU',
                                quantity: 100000000000,
                                reissuable: true,
                            })
                            .broadcast();
                    }}
                >
                    Sign Reissue
                </button>
            </div>

            <div>
                <h2>Account Script</h2>
                <button
                    onClick={() => {
                        signer
                            .setScript({
                                script:
                                    'AgQAAAAEdGhpcwkBAAAAB2V4dHJhY3QAAAABCAUAAAACdHgAAAAGc2VuZGVyBAAAAAckbWF0Y2gwBQAAAAJ0eAMJAAABAAAAAgUAAAAHJG1hdGNoMAIAAAATVHJhbnNmZXJUcmFuc2FjdGlvbgQAAAABdAUAAAAHJG1hdGNoMAQAAAANY29ycmVjdEFuc3dlcgkBAAAAB2V4dHJhY3QAAAABCQAEHAAAAAIFAAAABHRoaXMCAAAADWhhc2hlZCBhbnN3ZXIEAAAABmFuc3dlcgkAAfUAAAABCAUAAAABdAAAAAphdHRhY2htZW50AwkAAAAAAAACBQAAAA1jb3JyZWN0QW5zd2VyBQAAAAZhbnN3ZXIJAQAAAAEhAAAAAQkBAAAACWlzRGVmaW5lZAAAAAEIBQAAAAF0AAAAB2Fzc2V0SWQHAwMJAAABAAAAAgUAAAAHJG1hdGNoMAIAAAAPRGF0YVRyYW5zYWN0aW9uBgkAAAEAAAACBQAAAAckbWF0Y2gwAgAAABRTZXRTY3JpcHRUcmFuc2FjdGlvbgQAAAABcwUAAAAHJG1hdGNoMAkAAfQAAAADCAUAAAABcwAAAAlib2R5Qnl0ZXMJAAGRAAAAAggFAAAAAXMAAAAGcHJvb2ZzAAAAAAAAAAAACAUAAAABcwAAAA9zZW5kZXJQdWJsaWNLZXkHnYrj7g==',
                            })
                            .broadcast();
                    }}
                >
                    Set Script
                </button>
            </div>

            <div>
                <h2>Logout</h2>
                <button
                    onClick={() => {
                        signer.logout().then(() => setUserData(undefined));
                    }}
                >
                    Logout
                </button>
            </div>

            <div>
                <h1>Clear</h1>
                <button
                    onClick={() => {
                        localStorage.clear();
                        location.reload();
                    }}
                >
                    Clear storage
                </button>
            </div>
        </div>
    );
};

export default Home;
