const {sequelize} = require('./db');
const {Band, Musician} = require('./index')

describe('Band and Musician Models', () => {
    /**
     * Runs the code prior to all tests
     */
    beforeAll(async () => {
        // the 'sync' method will create tables based on the model class
        // by setting 'force:true' the tables are recreated each time the 
        // test suite is run
        await sequelize.sync({ force: true });
    })

    test('can create a Band', async () => {
        let createdBand = await Band.create({
            name: "abc",
            genre: "xyz"
        })
        expect(createdBand.genre).toBe("xyz");
        expect(createdBand.name).toBe("abc");
    })

    test('can create a Musician', async () => {
        let createdMusician = await Musician.create({
            name: "abc",
            instrument: "xyz"
        })
        expect(createdMusician.instrument).toBe("xyz");
        expect(createdMusician.name).toBe("abc");
    })

    test('can update band', async () => {
        let createdBand= await Band.create({
            name: "abc",
            genre: "xyz"
        })
        let updatedBand = await createdBand.update({
            name: "cba",
            genre: "zyx"
        })
        expect(updatedBand.name).toBe("cba")
        expect(updatedBand.genre).toBe("zyx")
    })

    describe('Musician and Band associations', () => {
    test('Musician belongs to Band', async () => {
    const band = await Band.create({ name: 'The Beatles' });
    const musician = await Musician.create({
      name: 'John Lennon',
      instrument: 'Guitar',
      BandId: band.id,
    });

    const fetchedMusician = await musician.reload();
    expect(fetchedMusician.BandId).toBe(band.id);
    const fetchedBand = await band.reload();
    const musicians = await fetchedBand.getMusicians();
    expect(musicians.length).toBe(1);
    expect(musicians[0].name).toBe('John Lennon');
    });

    test('Band has many Musicians', async () => {
    const band = await Band.create({ name: 'The Rolling Stones' });
    const musician1 = await Musician.create({
      name: 'Mick Jagger',
      instrument: 'Vocals',
      BandId: band.id,
    });
    
    const musician2 = await Musician.create({
      name: 'Keith Richards',
      instrument: 'Guitar',
      BandId: band.id,
    });
    
    const fetchedBand = await band.reload();
    const musicians = await fetchedBand.getMusicians();
    expect(musicians.length).toBe(2);
    expect(musicians.map((m) => m.name)).toContain('Mick Jagger');
    expect(musicians.map((m) => m.name)).toContain('Keith Richards');
  });
});

})