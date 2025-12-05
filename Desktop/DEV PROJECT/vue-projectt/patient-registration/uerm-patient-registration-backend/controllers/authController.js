const { sql } = require('../config/db');

exports.register = async (req, res) => {
    
    const body = req.body;
    
    const getValue = (val) => (typeof val === 'object' && val !== null ? val.name : val);

    const street = body.streetName || body.streetNameOutpatient || '';
    const brgy   = getValue(body.selectedBarangay) || getValue(body.selectedBarangayOutpatient) || '';
    const city   = getValue(body.selectedCity)     || getValue(body.selectedCityOutpatient)     || '';
    const region = getValue(body.selectedRegion)   || getValue(body.selectedRegionOutpatient)   || '';
    
    let province = getValue(body.selectedProvince) || getValue(body.selectedProvinceOutpatient) || '';
    if (province === 'NCR' || province === 'N/A (NCR)') {
        province = '';
    }

    const fullPresentAddress = [street, brgy, city, province, region]
        .filter(Boolean)
        .join(', ')
        .toUpperCase();

    const p = {
        lastName: body.lastName || body.lastNameOutpatient,
        firstName: body.firstName || body.firstNameOutpatient,
        middleName: body.middleName || body.middleNameOutpatient,
        age: body.age || body.ageOutpatient,
        gender: body.gender || body.genderOutpatient,
        civilStatus: body.civilStatus || body.civilStatusOutpatient,
        religion: body.religion || body.religionOutpatient,
        landline: body.landline || body.landlineOutpatient,
        mobile: body.mobile || body.mobileOutpatient,
        birthdate: (body.birthdate || body.birthdateOutpatient) ? new Date(body.birthdate || body.birthdateOutpatient) : null,
        birthplace: body.birthplace || body.birthplaceOutpatient,
        nationality: body.nationality || body.nationalityOutpatient,
        permanentAddress: body.permanentAddress || body.permanentAddressOutpatient,
        cpName: body.contactPersonInpatient || body.contactPersonOutpatientOutpatient, 
        cpRelationship: body.contactPersonInpatientRelationship || body.contactPersonRelationshipOutpatient, 
        patientType: body.patientType || '',
        signature: body.signature || body.signatureOutpatient,
    };

    const pool = await sql.connect();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();
        const request = new sql.Request(transaction);

        

        request
            .input('lastName', sql.NVarChar, p.lastName)
            .input('firstName', sql.NVarChar, p.firstName)
            .input('middleName', sql.NVarChar, p.middleName)
            .input('age', sql.Int, p.age)
            .input('gender', sql.NVarChar, p.gender)
            .input('civilStatus', sql.NVarChar, p.civilStatus)
            .input('religion', sql.NVarChar, p.religion)
            .input('landline', sql.NVarChar, p.landline)
            .input('mobile', sql.NVarChar, p.mobile)
            .input('email', sql.NVarChar, body.email)
            .input('birthdate', sql.Date, p.birthdate)      
            .input('birthplace', sql.NVarChar, p.birthplace)
            .input('nationality', sql.NVarChar, p.nationality)
            .input('presentAddress', sql.NVarChar, fullPresentAddress)
            .input('permanentAddress', sql.NVarChar, p.permanentAddress)
            
            .input('fathersName', sql.NVarChar, body.fathersName)
            .input('fathersAddress', sql.NVarChar, body.fathersAddress)
            .input('fatherContactNumber', sql.NVarChar, body.fatherContactNumber)
            .input('mothersName', sql.NVarChar, body.mothersName)
            .input('mothersAddress', sql.NVarChar, body.mothersAddress)
            .input('motherContactNumber', sql.NVarChar, body.motherContactNumber)
            
            .input('ptSourceIncome', sql.NVarChar, body.sourceOfIncome)
            .input('specificSourceOfIncome', sql.NVarChar, body.specificSourceOfIncome)
            .input('seniorpwd', sql.NVarChar, body.seniorpwd || body.scidnoOutpatient) 
            .input('sssgsis', sql.NVarChar, body.sssgsis)
            .input('tin', sql.NVarChar, body.tin)
            .input('others', sql.NVarChar, body.others)
            
            .input('ptGrossIncome', sql.NVarChar, body.pt_gross_income ? JSON.stringify(body.pt_gross_income) : null)
            .input('ptHomeOwnership', sql.NVarChar, body.pt_home_ownership ? JSON.stringify(body.pt_home_ownership) : null)
            .input('ptYearsStay', sql.NVarChar, body.pt_years_of_stay ? JSON.stringify(body.pt_years_of_stay) : null)
            .input('spouseName', sql.NVarChar, body.spouseName)
            .input('spouseOccupation', sql.NVarChar, body.spouseOccupation)
            .input('spouseEmployerContact', sql.NVarChar, body.spouseEmployerContact)
            .input('ptCars', sql.NVarChar, body.pthasCar)
            .input('ptCarOwnership', sql.NVarChar, body.carOwnership)

            .input('cpName', sql.NVarChar, p.cpName)
            .input('cpRelationship', sql.NVarChar, p.cpRelationship)
            .input('cpLandline', sql.NVarChar, body.contactPersonInpatientLandline)
            .input('cpMobile', sql.NVarChar, p.cpNumber) 
            .input('cpEmail', sql.NVarChar, body.contactPersonInpatientEmail)
            .input('cpAddress', sql.NVarChar, body.contactPersonInpatientAddress)
            .input('cpOccupation', sql.NVarChar, body.contactPersonInpatientOccupation)
            .input('cpEmployerNumber', sql.NVarChar, body.contactPersonInpatientEmployerNumber)
            .input('cpEmployerAddress', sql.NVarChar, body.contactPersonInpatientEmployerAddress)
            .input('cpIncomeSource', sql.NVarChar, body.contactPersonInpatientIncome ? JSON.stringify(body.contactPersonInpatientIncome) : null)
            .input('cpGrossIncome', sql.NVarChar, body.contactPersonInpatientGross ? JSON.stringify(body.contactPersonInpatientGross) : null)
            .input('cpHomeOwnership', sql.NVarChar, body.contactPersonInpatientHome ? JSON.stringify(body.contactPersonInpatientHome) : null)
            .input('cpHomeStay', sql.NVarChar, body.contactPersonInpatientHomeStay ? JSON.stringify(body.contactPersonInpatientHomeStay) : null)
            .input('cpHasCar', sql.NVarChar, body.contactPersonInpatienthasCar)
            .input('cpCarOwnership', sql.NVarChar, body.contactPersonInpatientcarOwnership)
            .input('cpNumberOfCars', sql.NVarChar, body.contactPersonInpatientnumberOfCars)

            .input('mop', sql.NVarChar, body.mop)
            .input('specificmop', sql.NVarChar, body.specificmop)
            .input('creditCard', sql.NVarChar, body.creditCard)
            .input('bank', sql.NVarChar, body.bank)
            .input('items', sql.NVarChar, body.items ? JSON.stringify(body.items) : null)

            .input('patientType', sql.NVarChar, p.patientType)
            .input('hmo', sql.NVarChar, body.hmoOutpatient)
            .input('scidnoOutpatient', sql.NVarChar, body.scidnoOutpatient)
            .input('philHealth', sql.NVarChar, body.outpatientPhilHealth ? JSON.stringify(body.outpatientPhilHealth) : null) 
            .input('medicalProcedure', sql.NVarChar, body.outpatientProcedure) 
            .input('physician', sql.NVarChar, body.outpatientPhysician);

        const patientResult = await request.query(`
            INSERT INTO patients_registration_forms (
                lastName, firstName, middleName, birthdate, age, birthplace, sex, 
                civilStatus, religion, nationality, landline, mobile, email, 
                addressPresent, addressPermanent, ptFatherName, ptFatherAddress, 
                ptFatherContact, ptMotherMaidenNam, ptMotherAddress, ptMotherContact, 
                ptSourceIncome, specificSourceOfIncome, seniorId, philhealthId,
                sssgsisId, tinID, others, ptGrossIncome, ptHomeOwnership,
                ptYearsStay, spouseName, spouseOccupation,spouseEmployerContact, ptCars, 
                ptCarOwnership, cpName, cpRelationship, cpLandline, cpMobile, cpEmail,
                cpAddress, cpOccupation, cpEmployerNumber, cpEmployerAddress,
                cpIncomeSource, cpGrossIncome, cpHomeOwnership, cpHomeStay,
                cpHasCar, cpCarOwnership, cpNumberOfCars, modeOfPayment, specificModeOfPayment, creditCards, 
                bankAffiliations, itemsReceived, patientType, hmo, scidnoOutpatient, philHealth, medicalProcedure, physician
            )
            OUTPUT INSERTED.patient_id 
            VALUES (
                @lastName, @firstName, @middleName, @birthdate, @age, @birthplace, @gender,
                @civilStatus, @religion, @nationality, @landline, @mobile, @email,
                @presentAddress, @permanentAddress, @fathersName, @fathersAddress,
                @fatherContactNumber, @mothersName, @mothersAddress, @motherContactNumber,
                @ptSourceIncome, @specificSourceOfIncome, @seniorpwd, @philhealth,
                @sssgsis, @tin, @others, @ptGrossIncome, @ptHomeOwnership,
                @ptYearsStay, @spouseName, @spouseOccupation,@spouseEmployerContact, @ptCars,
                @ptCarOwnership, @cpName, @cpRelationship, @cpLandline, @cpMobile, @cpEmail,
                @cpAddress, @cpOccupation, @cpEmployerNumber, @cpEmployerAddress,
                @cpIncomeSource, @cpGrossIncome, @cpHomeOwnership, @cpHomeStay, @cpHasCar, 
                @cpCarOwnership, @cpNumberOfCars, @mop, @specificmop, @creditCard, @bank, @items, @patientType, @hmo, @scidnoOutpatient, @philHealth, @medicalProcedure, @physician
            )
        `);

        const newPatientID = patientResult.recordset[0]?.patient_id;

        if (p.signature && newPatientID) {
            try {
                const cleanSignature = p.signature.replace(/^data:image\/\w+;base64,/, "");
                const finalSignatureBuffer = Buffer.from(cleanSignature, 'base64');
                
                const signRequest = new sql.Request(transaction); 
                signRequest.input('pId', sql.Int, newPatientID);
                signRequest.input('signData', sql.VarBinary(sql.MAX), finalSignatureBuffer);

                await signRequest.query(`
                    INSERT INTO ptSignature (patient_id, eSignature)
                    VALUES (@pId, @signData)
                `);
            } catch (sigError) {
                throw sigError; 
            }
        }

        await transaction.commit(); 

        res.status(201).json({ 
            message: "User registered successfully", 
            patientId: newPatientID 
        });

    } catch (err) {
        if (transaction) {
            try {
                await transaction.rollback();
            } catch (rollbackErr) {
                console.error("Rollback failed:", rollbackErr);
            }
        }

        console.error("Register Error:", err);
        if (err.number === 2627) { 
            return res.status(409).json({ message: "Email or Unique record already exists" });
        }
        res.status(500).json({ message: "Server error: " + err.message });
    }
};