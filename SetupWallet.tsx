/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import * as wt from '@waves/waves-transactions';
import {
    addPrivateKeyUser,
    addSeedUser,
} from './packages/provider-ke-wallet-ui/src/services/userService';

enum SetupSellection {
    None,
    Import,
    Create,
}
enum ImportOption {
    SeedPhrase,
    PrivateKey,
}

const SetupWallet: React.FC = () => {
    const initialData = {
        newPassword: '',
        seedPhrase: '',
        privateKey: '',
    };
    const [formData, setFormData] = useState(initialData);
    const [setupSellected, setSetupSellected] = useState<SetupSellection>(
        SetupSellection.None
    );
    const [importOpt, setImportOpt] = useState<ImportOption>(
        ImportOption.SeedPhrase
    );
    const [currentTab, setCurrentTab] = useState<number>(1);
    const [errText, setErrText] = useState<string>('');
    const passDisplay = (userInput: string) => {
        let emptyStr = '';

        if (userInput) {
            emptyStr = userInput.substring(0, 4);
            if (userInput.length > 3) {
                emptyStr += Array(userInput.length - 4)
                    .fill('*')
                    .join('');
            }
        }

        return emptyStr;
    };

    // handlers
    const inputChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void = (event) => {
        const { value, name } = event.target;

        if (value.length < 6)
            setErrText('password must be at least 6 characters in length');
        else setErrText('');

        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleSubmit: (event: React.MouseEvent<HTMLButtonElement>) => void = (
        event
    ) => {
        event.preventDefault();
        if (!formData.newPassword) return;
        if (formData.seedPhrase)
            addSeedUser(formData.seedPhrase, formData.newPassword, 84);
        else if (formData.privateKey)
            addPrivateKeyUser(formData.privateKey, formData.newPassword, 84);

        alert('KE Wallet has been created successful!');
        setFormData(initialData);
        location.reload();
    };

    // renderer
    const renderWalletCreationComponent = () => {
        const step = () => {
            switch (currentTab) {
                case 1:
                    return (
                        <div>
                            <h2>Create Password</h2>
                            <p>
                                This password will unlock your KE Wallet only on
                                this browser.
                            </p>
                            <p>
                                <input
                                    type="password"
                                    placeholder="New Password..."
                                    name="newPassword"
                                    value={formData.newPassword}
                                    minLength={6}
                                    onChange={inputChange}
                                />
                            </p>
                        </div>
                    );
                case 2:
                    return (
                        <div>
                            <h2>Secure Wallet</h2>
                            <p>
                                This is your secrete Recovery Phrase. Write it
                                down on a paper and keep it in a safe place.
                                You'll be asked to re-enter this phrase on this
                                wallet next.
                            </p>
                            <p>
                                <textarea
                                    placeholder="Your seed phrase..."
                                    value={formData.seedPhrase}
                                    name="seedPhrase"
                                    readOnly={true}
                                />
                            </p>
                            <button
                                onClick={() => {
                                    const seed = wt.libs.crypto.randomSeed(12);

                                    setFormData({
                                        ...formData,
                                        seedPhrase: seed,
                                    });
                                }}
                            >
                                Generate Seed Phrase
                            </button>
                        </div>
                    );
                case 3:
                    return (
                        <div>
                            <h2>Review</h2>
                            <label>Your Seed Phrase:</label>
                            <br />
                            <textarea
                                placeholder="Your seed phrase..."
                                value={formData.seedPhrase}
                                name="seedPhrase"
                                readOnly={true}
                            />
                            <p>
                                <label>Password: </label>
                                <span>{passDisplay(formData.newPassword)}</span>
                            </p>
                            <p>
                                <label>PublicKey: </label>
                                <span>
                                    {wt.libs.crypto.publicKey(
                                        formData.seedPhrase
                                    )}
                                </span>
                            </p>
                            <p>
                                <label>PrivateKey: </label>
                                <span>
                                    {wt.libs.crypto.privateKey(
                                        formData.seedPhrase
                                    )}
                                </span>
                            </p>
                            <p>
                                <label>Mainnet Address: </label>
                                <span>
                                    {wt.libs.crypto.address(
                                        formData.seedPhrase
                                    )}
                                </span>
                            </p>
                            <p>
                                <label>Testnet Address: </label>
                                <span>
                                    {wt.libs.crypto.address(
                                        formData.seedPhrase,
                                        'T'
                                    )}
                                </span>
                            </p>
                            <button type="button" onClick={handleSubmit}>
                                Create
                            </button>
                        </div>
                    );
                default:
                    return <div></div>;
            }
        };

        return (
            <div>
                {step()}
                <div style={{ overflow: 'auto' }}>
                    <div style={{ float: 'right' }}>
                        <button
                            type="button"
                            onClick={() => setCurrentTab(currentTab - 1)}
                            disabled={currentTab === 1}
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentTab(currentTab + 1)}
                            disabled={currentTab === 3}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderWalletImportComponent = () => {
        return (
            <div>
                <h1>KE Wallet</h1>
                <h2>Choose Import Option</h2>
                <div>
                    <button
                        onClick={() => setImportOpt(ImportOption.SeedPhrase)}
                    >
                        Seed Phrase
                    </button>
                    <button
                        onClick={() => setImportOpt(ImportOption.PrivateKey)}
                    >
                        Private Key
                    </button>
                </div>
                <div>
                    {importOpt === ImportOption.SeedPhrase ? (
                        <textarea
                            placeholder="Your seed phrase..."
                            value={formData.seedPhrase}
                            onChange={inputChange}
                            name="seedPhrase"
                        />
                    ) : (
                        <input
                            type="text"
                            placeholder="Your Private Key..."
                            name="privateKey"
                            value={formData.privateKey}
                            onChange={inputChange}
                        />
                    )}

                    <p>
                        <input
                            type="password"
                            placeholder="New Password..."
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={inputChange}
                        />
                    </p>
                    <button type="button" onClick={handleSubmit}>
                        Import
                    </button>
                </div>
            </div>
        );
    };

    const renderComponent = () => {
        const option = () => {
            switch (setupSellected) {
                case SetupSellection.None:
                    return (
                        <div>
                            <h1>Wallet Setup</h1>
                            <div>
                                <button
                                    onClick={() =>
                                        setSetupSellected(
                                            SetupSellection.Import
                                        )
                                    }
                                >
                                    Import Seed Phrase
                                </button>
                                <button
                                    onClick={() =>
                                        setSetupSellected(
                                            SetupSellection.Create
                                        )
                                    }
                                >
                                    Create New Wallet
                                </button>
                            </div>
                        </div>
                    );
                case SetupSellection.Create:
                    return renderWalletCreationComponent();
                case SetupSellection.Import:
                    return renderWalletImportComponent();
                default:
                    return (
                        <div>
                            <h2>Not a Valid Option</h2>
                        </div>
                    );
            }
        };

        return (
            <div>
                {option()}
                <p>{errText}</p>
            </div>
        );
    };

    return renderComponent();
};

export default SetupWallet;
