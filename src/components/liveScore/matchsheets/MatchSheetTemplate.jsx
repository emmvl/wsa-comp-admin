import React from 'react';
import PropTypes from 'prop-types';
import { Document as ReactPdfDocument, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 16,
        width: '100%',
        backgroundColor: '#FFFFFF',
    },
    document: {
        width: '100%',
    },
    header: {
        paddingHorizontal: 16,
        marginBottom: 8,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    associationName: {
        fontSize: 14,
        fontWeight: 'bold',
        padding: '8px 0',
    },
    templateType: {
        fontSize: 12,
    },
    title: {
        width: '50%',
    },
    logo: {
        width: 50,
        height: 50,
    },
    matchInfo: {
        padding: 8,
        flexDirection: 'row',
    },
    infoContent: {
        width: '50%',
        paddingRight: 16,
        paddingLeft: 8,
    },
    infoText: {
        fontSize: 9,
        marginBottom: 4,
    },
    tableContent: {
        width: '100%',
        flexDirection: 'row',
        paddingLeft: 8,
    },
    signTable: {
        width: '50%',
        padding: 8,
        paddingRight: 16,
    },
    table: {
        border: '1px solid black',
        borderRight: 0,
        borderBottom: 0,
    },
    row: {
        width: '100%',
        height: 10,
        flexDirection: 'row',
        fontSize: 8,
        borderBottom: '1px solid black',
    },
    cell: {
        width: '8%',
        borderRight: '1px solid black',
        textAlign: 'center',
    },
    largeCell: {
        width: '30%',
        borderRight: '1px solid black',
        textAlign: 'center',
    },
    subTitle: {
        padding: 9,
        paddingLeft: 16,
        fontSize: 9,
    },
    passCell: {
        width: '2.5%',
        borderRight: '1px solid black',
        textAlign: 'center',
    },
    passTable: {
        width: '100%',
        padding: 8,
        paddingRight: 16,
    },
    passRow: {
        width: '100%',
        height: 16,
        flexDirection: 'row',
        fontSize: 9,
        borderBottom: '1px solid black',
    },
    scoreTableRight: {
        width: '50%',
        padding: 8,
        paddingRight: 16,
    },
    scoreTableLeft: {
        width: '50%',
        padding: 8,
        paddingRight: 16,
        borderRight: '1px solid black',
    },
    scoreCell: {
        width: '5%',
        textAlign: 'center',
    },
    scoreRow: {
        width: '100%',
        height: 12,
        flexDirection: 'row',
        fontSize: 9,
    },
    tableTitle: {
        fontSize: 9,
        marginBottom: 12,
    },
    summaryTable: {
        width: '100%',
        padding: 8,
        paddingRight: 16,
    },
    summaryRow: {
        width: '100%',
        height: 15,
        flexDirection: 'row',
        fontSize: 9,
        borderBottom: '1px solid black',
    },
    summaryCell: {
        width: '25%',
        paddingLeft: 12,
        paddingTop: 2,
    },
    gapCell: {
        width: '4%',
        borderRight: '1px solid black',
        textAlign: 'center',
    },
    signatureCell: {
        width: '23%',
        paddingTop: 2,
        borderRight: '1px solid black',
    },
    voteCell: {
        width: '20%',
        paddingLeft: 12,
        paddingTop: 2,
        borderRight: '1px solid black',
    },
    teamCell: {
        width: '40%',
        paddingLeft: 12,
        paddingTop: 2,
        borderRight: '1px solid black',
    },
    goalTable: {
        width: '100%',
        padding: 8,
        paddingRight: 16,
    },
    goalRow: {
        width: '100%',
        height: 24,
        flexDirection: 'row',
        fontSize: 8,
        borderBottom: '1px solid black',
    },
    goalCell: {
        width: '6%',
        borderRight: '1px solid black',
        textAlign: 'center',
    },
    goalCheckCell: {
        width: '29%',
        borderRight: '1px solid black',
    },
    goalSubCell: {
        height: 12,
        textAlign: 'center',
        padding: 1,
        borderBottom: '1px solid black',
    },
});

const MatchSheetTemplate = (props) => {
    const { templateType } = props;

    return (
        <View>
            <View style={styles.header}>
                <View style={styles.title}>
                    <Text style={styles.associationName}>Brisbane City Netball Association</Text>
                    <Text style={styles.templateType}>{templateType} Scoresheet</Text>
                </View>
                <Image style={styles.logo} src="https://img.icons8.com/color/myspace"/>
            </View>
            <View style={styles.matchInfo}>
                <View style={styles.infoContent}>
                    <Text style={styles.infoText}>Round: 1</Text>
                    <Text style={styles.infoText}>Venue: John Fisher Court 1</Text>
                    <Text style={styles.infoText}>H: Team 1</Text>
                </View>
                <View style={styles.infoContent}>
                    <Text style={styles.infoText}>Date: 22/05/2020</Text>
                    <Text style={styles.infoText}>Time: 10:10 am</Text>
                    <Text style={styles.infoText}>A: Team 2</Text>
                </View>
            </View>
            {templateType !== 'Carnival' && (
                <View style={styles.tableContent}>
                    <View style={styles.signTable}>
                        <View style={styles.table}>
                            <View style={styles.row}>
                                <Text style={styles.cell}>#</Text>
                                <Text style={styles.largeCell}>Player Name</Text>
                                <Text style={styles.largeCell}>Signature</Text>
                                <Text style={styles.cell}>1</Text>
                                <Text style={styles.cell}>2</Text>
                                <Text style={styles.cell}>3</Text>
                                <Text style={styles.cell}>4</Text>
                            </View>
                            {[...Array(15).keys()].map((index) => (
                                <View style={styles.row} key={`row_${index}`}>
                                    <Text style={styles.cell}></Text>
                                    <Text style={styles.largeCell}></Text>
                                    <Text style={styles.largeCell}></Text>
                                    <Text style={styles.cell}></Text>
                                    <Text style={styles.cell}></Text>
                                    <Text style={styles.cell}></Text>
                                    <Text style={styles.cell}></Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <View style={styles.signTable}>
                        <View style={styles.table}>
                            <View style={styles.row}>
                                <Text style={styles.cell}>#</Text>
                                <Text style={styles.largeCell}>Player Name</Text>
                                <Text style={styles.largeCell}>Signature</Text>
                                <Text style={styles.cell}>1</Text>
                                <Text style={styles.cell}>2</Text>
                                <Text style={styles.cell}>3</Text>
                                <Text style={styles.cell}>4</Text>
                            </View>
                            {[...Array(15).keys()].map((rowIndex) => (
                                <View style={styles.row} key={`row_${rowIndex}`}>
                                    <Text style={styles.cell}></Text>
                                    <Text style={styles.largeCell}></Text>
                                    <Text style={styles.largeCell}></Text>
                                    <Text style={styles.cell}></Text>
                                    <Text style={styles.cell}></Text>
                                    <Text style={styles.cell}></Text>
                                    <Text style={styles.cell}></Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            )}
            <Text style={styles.subTitle}>Centre Pass</Text>
            <View style={styles.tableContent}>
                <View style={styles.passTable}>
                    <View style={styles.table}>
                        {[...Array(4).keys()].map((rowIndex) => (
                            <View style={styles.passRow} key={`row_${rowIndex}`}>
                                {[...Array(40).keys()].map((cellIndex) => (
                                    <Text style={styles.passCell} key={`cell_${cellIndex}`}></Text>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
            </View>
            <Text style={styles.subTitle}>Progressive Score</Text>
            <View style={styles.tableContent}>
                <View style={styles.scoreTableLeft}>
                    <Text style={styles.tableTitle}>Team 1</Text>
                    {[...Array(4).keys()].map((rowIndex) => (
                        <View style={styles.scoreRow} key={`row_${rowIndex}`}>
                            {[...Array(20).keys()].map((cellIndex) => (
                                <Text style={styles.scoreCell} key={`cell_${cellIndex}`}>{cellIndex + 1 + 20 * rowIndex}</Text>
                            ))}
                        </View>
                    ))}
                </View>
                <View style={styles.scoreTableRight}>
                    <Text style={styles.tableTitle}>Team 2</Text>
                    {[...Array(4).keys()].map((rowIndex) => (
                        <View style={styles.scoreRow} key={`row_${rowIndex}`}>
                            {[...Array(20).keys()].map((cellIndex) => (
                                <Text style={styles.scoreCell} key={`cell_${cellIndex}`}>{cellIndex + 1 + 20 * rowIndex}</Text>
                            ))}
                        </View>
                    ))}
                </View>
            </View>
            {templateType !== 'Social' && (
                <>
                    <Text style={styles.subTitle}>Goal Statistics</Text>
                    <View style={styles.tableContent}>
                        <View style={styles.goalTable}>
                            <View style={styles.table}>
                                {[...Array(4).keys()].map((rowIndex) => (
                                    <View style={styles.goalRow} key={`row_${rowIndex}`}>
                                        <View style={styles.goalCell}>
                                            <Text style={styles.goalSubCell}>Q {rowIndex + 1}</Text>
                                            <Text></Text>
                                        </View>
                                        <View style={styles.goalCell}>
                                            <Text style={styles.goalSubCell}>GS</Text>
                                            <Text>GA</Text>
                                        </View>
                                        <View style={styles.goalCheckCell}>
                                            <Text style={styles.goalSubCell}></Text>
                                            <Text></Text>
                                        </View>
                                        <View style={styles.goalCell}>
                                            <Text style={styles.goalSubCell}></Text>
                                            <Text></Text>
                                        </View>
                                        <Text style={styles.goalCell}></Text>
                                        <View style={styles.goalCell}>
                                            <Text style={styles.goalSubCell}>GS</Text>
                                            <Text>GA</Text>
                                        </View>
                                        <View style={styles.goalCheckCell}>
                                            <Text style={styles.goalSubCell}></Text>
                                            <Text></Text>
                                        </View>
                                        <View style={styles.goalCell}>
                                            <Text style={styles.goalSubCell}></Text>
                                            <Text></Text>
                                        </View>
                                        <Text style={styles.goalCell}></Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                    <Text style={styles.subTitle}>MVP</Text>
                    <View style={styles.tableContent}>
                        <View style={styles.summaryTable}>
                            <View style={styles.table}>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.voteCell}>3 Votes</Text>
                                    <Text style={styles.teamCell}>Name</Text>
                                    <Text style={styles.teamCell}>Team</Text>
                                </View>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.voteCell}>2 Votes</Text>
                                    <Text style={styles.teamCell}>Name</Text>
                                    <Text style={styles.teamCell}>Team</Text>
                                </View>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.voteCell}>1 Votes</Text>
                                    <Text style={styles.teamCell}>Name</Text>
                                    <Text style={styles.teamCell}>Team</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </>
            )}
            <View style={styles.tableContent}>
                <View style={styles.summaryTable}>
                    <View style={styles.table}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryCell}>Scorer 1</Text>
                            <Text style={styles.signatureCell}>Signature</Text>
                            <Text style={styles.gapCell}></Text>
                            <Text style={styles.summaryCell}>Scorer 2</Text>
                            <Text style={styles.signatureCell}>Signature</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryCell}>Umpire</Text>
                            <Text style={styles.signatureCell}>Signature</Text>
                            <Text style={styles.gapCell}></Text>
                            <Text style={styles.summaryCell}>Umpire</Text>
                            <Text style={styles.signatureCell}>Signature</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryCell}>Captain</Text>
                            <Text style={styles.signatureCell}>Signature</Text>
                            <Text style={styles.gapCell}></Text>
                            <Text style={styles.summaryCell}>Captain</Text>
                            <Text style={styles.signatureCell}>Signature</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
};

MatchSheetTemplate.propTypes = {
    templateType: PropTypes.string,
};

MatchSheetTemplate.defaultProps = {
    templateType: 'Fixtures',
};

export default MatchSheetTemplate;
