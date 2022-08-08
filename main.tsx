import React, { useEffect, useState, useMemo } from 'react';
import { render } from 'react-dom';
import { Signer } from '@waves/signer';
import { ProviderKEWallet } from './packages/provider-ke-wallet/src';
import * as wt from '@waves/waves-transactions';
import { hasMultiaccount } from './packages/provider-ke-wallet-ui/src/services/userService';
import { PlateNote } from '@waves.exchange/react-uikit';
import SetupWallet from './SetupWallet';
import Home from './Home';

const url = location.href.includes('provider=ke-wallet')
    ? 'https://ke.wallet/signer'
    : location.origin + '/packages/provider-ke-wallet-ui/index.html';

const node = location.href.includes('mainnet')
    ? 'https://nodes.wavesplatform.com'
    : 'https://nodes-testnet.wavesnodes.com';

const networkByte = location.href.includes('mainnet') ? 87 : 84;

function TestApp(): React.ReactElement {
    const provider = useMemo(() => new ProviderKEWallet(url, true), []);
    const signer = useMemo(() => new Signer({ NODE_URL: node }), []);
    const [chainId, setChainId] = useState(networkByte)
    const [hasMultiacc, setMultiacc] = useState(false);
    const [isIncognito, setIncognito] = useState(false);

    useEffect(() => {
        signer.setProvider(provider);
        signer.getNetworkByte().then(val => setChainId(val));
    }, [provider, signer]);

    useEffect(() => {
        try {
            localStorage.setItem('___test_storage_key___', 'test');
            localStorage.getItem('___test_storage_key___');
            localStorage.removeItem('___test_storage_key___');
            setMultiacc(hasMultiaccount());
        } catch (e) {
            setIncognito(true);
        }
    }, [signer]);

    if (isIncognito)
        return (
            <PlateNote
                type="error"
                color="standard.$0"
                fontSize="14px"
                lineHeight="20px"
            >
                The authorization in the incognito mode is unavailable. Please,
                exit from the incognito mode and try again.
            </PlateNote>
        );
    
    return hasMultiacc ? <Home signer={signer} chainId={chainId} /> : <SetupWallet />;
}

render(<TestApp />, document.getElementById('root'));
