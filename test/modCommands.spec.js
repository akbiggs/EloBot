import {ModCommandList} from "../src/utils/modCommands.js";
import sinon from "sinon";
import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const { expect } = require('chai');
import truncate from "../scripts/truncate";
import {addMatch, addUser, rating, updateUser} from "../src/utils/database";
import models from "../src/models";
import Koth from '../src/utils/koth'
import {CommandList} from "../src/utils/commands";
import dotenv from 'dotenv';
dotenv.config();
const starting_rating = Number(process.env.DEFAULT_RATING);


let client = {
    say: function (target, msg) {}
};
let mockC = sinon.mock(client);

describe('arenaid command', async() =>{
    const target = '';
    const command = 'arenaid';
    const aid = 'ARENA1234';
    const aid2 = 'SECONDARENA';
    let args = [];
    beforeEach(async () => {
        mockC = sinon.mock(client);
        Koth.clear()
    });
    it('responds with the aid', async ()=>{
        Koth.aid = aid;
        mockC.expects("say").once().withExactArgs(target,
            `The Arena ID is ${aid}.`);
        await ModCommandList[command].handle(args, target, client , '');
        mockC.verify();
    });

    it('properly sets the aid', async ()=>{
        Koth.aid = aid;
        args = [aid2];
        mockC.expects("say").once().withExactArgs(target,
            `The Arena ID is set to ${aid2}.`);
        await ModCommandList[command].handle(args, target, client , '');
        mockC.verify();
        expect(Koth.aid).to.equal(aid2)
    });
    it('properly fails with too many args', async ()=>{
        Koth.aid = aid;
        args = [aid2, aid];
        mockC.expects("say").once().withExactArgs(target,
            `Please only send in the Arena ID separated by a space after !arenaid`);
        await ModCommandList[command].handle(args, target, client , '');
        mockC.verify();
    });
});

describe('arenaid2 command', async() =>{
    const target = '';
    const command = 'arenaid2';
    const aid = 'ARENA1234';
    const aid2 = 'SECONDARENA';
    let args = [];
    beforeEach(async () => {
        mockC = sinon.mock(client);
        Koth.clear()
    });
    it('responds with the aid', async ()=>{
        Koth.aid2 = aid;
        mockC.expects("say").once().withExactArgs(target,
            `The Arena 2 ID is ${aid}.`);
        await ModCommandList[command].handle(args, target, client , '');
        mockC.verify();
    });

    it('properly sets the aid', async ()=>{
        Koth.aid2 = aid;
        args = [aid2];
        mockC.expects("say").once().withExactArgs(target,
            `The Arena 2 ID is set to ${aid2}.`);
        await ModCommandList[command].handle(args, target, client , '');
        mockC.verify();
        expect(Koth.aid2).to.equal(aid2)
    });
    it('properly fails with too many args', async ()=>{
        Koth.aid2 = aid;
        args = [aid2, aid];
        mockC.expects("say").once().withExactArgs(target,
            `Please only send in the Arena ID separated by a space after !arenaid2`);
        await ModCommandList[command].handle(args, target, client , '');
        mockC.verify();
    });
});

describe('arenaid3 command', async() =>{
    const target = '';
    const command = 'arenaid3';
    const aid = 'ARENA1234';
    const aid2 = 'SECONDARENA';
    let args = [];
    beforeEach(async () => {
        mockC = sinon.mock(client);
        Koth.clear()
    });
    it('responds with the aid', async ()=>{
        Koth.aid3 = aid;
        mockC.expects("say").once().withExactArgs(target,
            `The Arena 3 ID is ${aid}.`);
        await ModCommandList[command].handle(args, target, client , '');
        mockC.verify();
    });

    it('properly sets the aid', async ()=>{
        Koth.aid3 = aid;
        args = [aid2];
        mockC.expects("say").once().withExactArgs(target,
            `The Arena 3 ID is set to ${aid2}.`);
        await ModCommandList[command].handle(args, target, client , '');
        mockC.verify();
        expect(Koth.aid3).to.equal(aid2)
    });
    it('properly fails with too many args', async ()=>{
        Koth.aid3 = aid;
        args = [aid2, aid];
        mockC.expects("say").once().withExactArgs(target,
            `Please only send in the Arena ID separated by a space after !arenaid3`);
        await ModCommandList[command].handle(args, target, client , '');
        mockC.verify();
    });
});


describe('win command', async() =>{
    const command = 'win';
    const user = 'Testy';
    const user2 = 'McTestface';
    const user3 = 'Besty';
    const args = [];
    const target = '';
    const starting_rating = Number(process.env.DEFAULT_RATING);
    beforeEach(async () => {
        Koth.clear();
        await truncate();
        await addUser(user);
        await addUser(user2);
        Koth.add(user);
        Koth.add(user2);
        mockC = sinon.mock(client);
    });
    it('Says an error when there is 0 users in the queue', async() => {
        Koth.clear();
        mockC.expects("say").once().withExactArgs('',
            `There needs to be at least a king and one challenger for someone to win.`);
        await ModCommandList[command].handle(args, target, client, user);

        mockC.verify();
    });
    it('Says an error when there is 1 user in queue', async() => {
        Koth.clear()
        Koth.add(user);
        mockC.expects("say").once().withExactArgs('',
            `There needs to be at least a king and one challenger for someone to win.` );
        await ModCommandList[command].handle(args, target, client , user);

        mockC.verify();
    });
    it('Records the king winning properly no one else in queue', async() =>{
        mockC.expects("say").once();
        await ModCommandList[command].handle(args, '', client , user);
        mockC.verify();

        let u1r = await rating(user);
        let u2r = await rating(user2);
        expect(u1r).to.be.above(u2r);
        expect(Koth.get(user2)).to.equal(-1)
    });

    it('Records the king winning properly with one more in queue', async() =>{
        Koth.add(user3);
        mockC.expects("say").once();
        await ModCommandList[command].handle(args, '', client , user);
        mockC.verify();

        let u1r = await rating(user);
        let u2r = await rating(user2);
        expect(u1r).to.be.above(u2r);
        expect(Koth.get(user2)).to.equal(-1);
        expect(Koth.get().length).to.equal(2);
    });

});

describe('lose command', async() =>{
    const command = 'lose';
    const user = 'testy';
    const user2 = 'mctestface';
    const user3 = 'besty';
    const args = [];
    const target = '';
    const starting_rating = Number(process.env.DEFAULT_RATING);
    beforeEach(async () => {
        Koth.clear();
        await truncate();
        await addUser(user);
        await addUser(user2);
        Koth.add(user);
        Koth.add(user2);
        mockC = sinon.mock(client);
    });

    it('Says an error when there is 0 users in the queue', async() => {
        Koth.clear();
        mockC.expects("say").once().withExactArgs('',
            `There needs to be at least a king and one challenger for someone to lose.`);
        await ModCommandList[command].handle(args, target, client, user);

        mockC.verify();
    });
    it('Says an error when there is 1 user in queue', async() => {
        Koth.clear();
        Koth.add(user);
        mockC.expects("say").once().withExactArgs('',
            `There needs to be at least a king and one challenger for someone to lose.` );
        await ModCommandList[command].handle(args, target, client , user);

        mockC.verify();
    });
    it('Records the king losing properly no one else in queue', async() =>{
        mockC.expects("say").once();
        await ModCommandList[command].handle(args, '', client , user);
        mockC.verify();

        let u1r = await rating(user);
        let u2r = await rating(user2);
        expect(u2r).to.be.above(u1r);
        expect(Koth.get(user)).to.equal(-1)
    });

    it('Records the king winning properly with one more in queue', async() =>{
        Koth.add(user3);
        mockC.expects("say").once();
        await ModCommandList[command].handle(args, '', client , user);
        mockC.verify();

        let u1r = await rating(user);
        let u2r = await rating(user2);
        expect(u2r).to.be.above(u1r);
        expect(Koth.get(user)).to.equal(-1);
        expect(Koth.get(user2)).to.equal(0);
        expect(Koth.get().length).to.equal(2);
    });

});

describe('open command', async() =>{
    const target = '';
    const command = 'open';
    let args = [];
    beforeEach(async () => {
        mockC = sinon.mock(client);
        Koth.clear()
    });
    it('responds that the list is already open', async ()=>{
        mockC.expects("say").once().withExactArgs(target,
            `The list is already open!`);
        await ModCommandList[command].handle(args, target, client , '');
        mockC.verify();
        expect(Koth.open).to.be.true
    });
    it('responds that the list is now open when closed', async ()=>{
        Koth.close();
        mockC.expects("say").once().withExactArgs(target,
            `The list is now open!`);
        await ModCommandList[command].handle(args, target, client , '');
        mockC.verify();
        expect(Koth.open).to.be.true
    });
});

describe('close command', async() =>{
    const target = '';
    const command = 'close';
    let args = [];
    beforeEach(async () => {
        mockC = sinon.mock(client);
        Koth.clear();
        Koth.openList()
    });
    it('responds that the list is already closed', async ()=>{
        Koth.close();
        mockC.expects("say").once().withExactArgs(target,
            `The list is already closed!`);
        await ModCommandList[command].handle(args, target, client , '');
        mockC.verify();
        expect(Koth.open).to.be.false
    });
    it('responds that the list is now open when closed', async ()=>{
        mockC.expects("say").once().withExactArgs(target,
            `The list is now closed!`);
        await ModCommandList[command].handle(args, target, client , '');
        mockC.verify();
        expect(Koth.open).to.be.false;
        Koth.openList()
    });
});

describe('add command', async() =>{
    const target = '';
    const command = 'add';
    const user = 'testy';
    const user2 = 'mctestface';
    let args = [];
    beforeEach(async () => {
        mockC = sinon.mock(client);
        Koth.clear();
    });
    it('Does not add anything to list with no params', async ()=> {

        mockC.expects("say").once().withExactArgs(target,
            `please call add like this '!add @username' or '!add @username [number]'`);
        await ModCommandList[command].handle(args, target, client, '');
        mockC.verify();
        expect(Koth.get(user)).to.equal(-1)
    });
    it('Adds user to list', async ()=>{

        let args = ['@'+user];
        mockC.expects("say").once().withExactArgs(target,
            `${user} added to list!`);
        await ModCommandList[command].handle(args, target, client , '');
        mockC.verify();
        expect(Koth.get(user)).to.equal(0)
    });
    it('Does not add user to list if already there', async ()=>{
        Koth.add(user);
        let args = ['@'+user];
        mockC.expects("say").once().withExactArgs(target,
            `${user} is already in the list!`);
        await ModCommandList[command].handle(args, target, client , '');
        mockC.verify();
    });
    it('Adds user to list at position', async ()=>{
        Koth.add(user);
        let args = ['@'+user2, '0'];
        mockC.expects("say").once().withExactArgs(target,
            `${user2} added to list at position 0!`);
        await ModCommandList[command].handle(args, target, client , '');
        mockC.verify();
        expect(Koth.get(user2)).to.equal(0)
    });
    it('Does not add user to list at position when it is in list already', async ()=>{
        Koth.add(user);
        let args = ['@'+user, '0'];
        mockC.expects("say").once().withExactArgs(target,
            `${user} is already in the list!`);
        await ModCommandList[command].handle(args, target, client , '');
        mockC.verify();
        expect(Koth.get(user)).to.equal(0)
    });
    it('Does not add user to list at position when malformed input', async ()=>{
        Koth.add(user);
        let args = ['@'+user2, 'thisisnotanumber'];
        mockC.expects("say").once().withExactArgs(target,
            `Please use a number when calling '!add @username [number]'`);
        await ModCommandList[command].handle(args, target, client , '');
        mockC.verify();
        expect(Koth.get(user2)).to.equal(-1)
    });
});

describe('remove command', async() =>{
    const target = '';
    const command = 'remove';
    const user = 'testy';
    const user2 = 'mctestface';
    let args = [];
    beforeEach(async () => {
        mockC = sinon.mock(client);
        Koth.clear();
        Koth.add(user);
    });
    it('Does not remove user not in list', async ()=> {

        let args = ['@'+user2];
        mockC.expects("say").once().withExactArgs(target,
            `${user2} is not in the list!`);
        await ModCommandList[command].handle(args, target, client, '');
        mockC.verify();
        expect(Koth.get(user2)).to.equal(-1)
    });
    it('removes user that is in list', async ()=> {

        let args = ['@'+user];
        mockC.expects("say").once().withExactArgs(target,
            `${user} removed from list!`);
        await ModCommandList[command].handle(args, target, client, '');
        mockC.verify();
        expect(Koth.get(user)).to.equal(-1)
    });
});


describe('move command', async() =>{
    const target = '';
    const command = 'move';
    const user = 'testy';
    const user2 = 'mctestface';
    let args = [];
    beforeEach(async () => {
        mockC = sinon.mock(client);
        Koth.clear();
        Koth.add(user);
    });
    it('Does not remove user not in list', async ()=> {

        let args = ['@'+user2, 1];
        mockC.expects("say").once().withExactArgs(target,
            `${user2} is not in the list!`);
        await ModCommandList[command].handle(args, target, client, '');
        mockC.verify();
        expect(Koth.get(user2)).to.equal(-1)
    });
    it('removes user that is in list', async ()=> {

        Koth.add(user2);
        let args = ['@'+user, 0];
        mockC.expects("say").once().withExactArgs(target,
            `${user} moved in list to position ${0}!`);
        await ModCommandList[command].handle(args, target, client, '');
        mockC.verify();
        mockC = sinon.mock(client);
        expect(Koth.get(user)).to.equal(0);
        args = ['@'+user, 1];
        mockC.expects("say").once().withExactArgs(target,
            `${user} moved in list to position ${1}!`);
        await ModCommandList[command].handle(args, target, client, '');
        mockC.verify();
        expect(Koth.get(user)).to.equal(1)
    });
});

describe('clear command', async() =>{
    const target = '';
    const command = 'clear';
    let args = [];
    beforeEach(async () => {
        mockC = sinon.mock(client);
        Koth.clear()
    });
    it('clears the list', async ()=>{
        Koth.add('FEIFE');
        Koth.add('FEFR');
        mockC.expects("say").once().withExactArgs(target,
            `The list is now cleared!`);
        await ModCommandList[command].handle(args, target, client , '');
        mockC.verify();
        expect(Koth.get().length).to.equal(0)
    });
});

describe('Undoes a match', async() =>{
    const target = '';
    const command = 'undo';
    let args = [];
    const winner = 'testy';
    const loser = 'mctestface';
    const win_c = 14;
    const lose_c = 14;
    beforeEach(async () => {
        mockC = sinon.mock(client);
        Koth.clear();
        await truncate();
        await addUser(winner);
        await addUser(loser);
        await addMatch(winner, loser, starting_rating+win_c, starting_rating-lose_c, win_c, lose_c);

        await updateUser(winner, starting_rating+win_c);
        await updateUser(loser, starting_rating-lose_c);

    });
    it('clears the list', async ()=>{
        mockC.expects("say").once().withExactArgs(target,
            `Match between ${winner}(${starting_rating}) and ${loser} (${starting_rating}) undone and ratings are updated!`
        );
        await ModCommandList[command].handle(args, target, client , '');
        mockC.verify();
        expect(Koth.get().length).to.equal(0)
    });
});