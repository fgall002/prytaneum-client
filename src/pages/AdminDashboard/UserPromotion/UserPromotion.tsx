import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { Container, Paper, Grid, Switch, Typography } from '@material-ui/core';

import useEndpoint from 'hooks/useEndpoint';
import { promoteUser } from 'domains/AdminDashboard/api/api';
import { UserProfile } from 'domains/AdminDashboard/types';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
    },
    paper: {
        padding: theme.spacing(2),
    },
}));

interface Props {
    promotionOptions: string[];
    userData: UserProfile;
    onChange?: () => void;
}

const UserPromotion = ({ promotionOptions, userData, onChange: cb }: Props) => {
    const classes = useStyles();
    const [user, setUser] = useState<UserProfile>(userData);
    const [post] = useEndpoint(() => promoteUser(user, user._id), {
        onSuccess: cb,
    });

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        const copyUser = user;
        const newStatus = user.status.map((x) => {
            if (x.role === name) {
                return {
                    ...x,
                    active: checked,
                };
            }
            return x;
        });

        const updatedUser = { ...copyUser, status: newStatus };
        setUser(updatedUser);
        post();
    };

    const switches = user.status.reduce((acc: JSX.Element[], curr) => {
        const { role, active } = curr;
        if (promotionOptions.includes(role)) {
            acc.push(
                <Grid
                    container
                    item
                    key={role}
                    spacing={2}
                    alignContent='center'
                >
                    <Grid item xs={10}>
                        <Typography>{role}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Switch
                            checked={active}
                            onChange={onChangeHandler}
                            name={role}
                        />
                    </Grid>
                </Grid>
            );
        }
        return acc;
    }, []);

    return (
        <Container maxWidth='md' className={classes.root}>
            <Paper className={classes.paper}>
                <Grid
                    container
                    direction='column'
                    className={classes.root}
                    alignContent='center'
                    justify='center'
                >
                    {switches}
                </Grid>
            </Paper>
        </Container>
    );
};

UserPromotion.defaultProps = {
    promotionOptions: ['Admin', 'Organizer'],
    onChange: () => {},
};

UserPromotion.propTypes = {
    promotionOptions: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
};

export default UserPromotion;
