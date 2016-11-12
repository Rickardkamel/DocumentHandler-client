import { Injectable } from '@angular/core';
import { IReport } from './';
declare var pdfMake: any;

@Injectable()
export class PrintService {
    pdf: any;

    buildPdf(report: IReport, imageInBytes) {
        let reportArticles = report.articles;

        function createArtTable(articles) {
            let table = [];
            for (let i = 0; i < articles.length; i++) {
                table.push({
                    style: 'artTable',
                    id: 'tbl' + i,
                    table: {
                        widths: ['*', '*', '*', '*', '*', '*'],
                        body: [
                            [
                                { text: 'Art. nr', headlineLevel: i, style: 'tblLabel', colSpan: 2 },
                                {},
                                { text: 'Kärl', style: 'tblLabel' },
                                { text: 'Antal', style: 'tblLabelCenter' },
                                { text: 'Info', style: 'tblLabel', colSpan: 2 },
                                ''
                            ],

                            [
                                {
                                    text: report.articles[i].wasteId + ', ' + report.articles[i].waste.text, style: 'tblContent', colSpan: 2
                                },
                                {},
                                { text: report.articles[i].vessel.type, style: 'tblContent' },
                                { text: report.articles[i].quantity.toString(), style: 'tblContentCenter' },
                                { text: report.articles[i].info, colSpan: 2, rowSpan: 3, style: 'tblContent' },
                                {}
                            ],

                            [
                                { text: 'Beskrivning', style: 'tblLabel', colSpan: 3 },
                                {},
                                {},
                                { text: 'Byte', style: 'tblLabelCenter' },
                                '',
                                ''
                            ],

                            [
                                {
                                    text: report.articles[i].waste.unTextGroup,
                                    style: 'tblContent', colSpan: 3
                                },
                                {},
                                {},
                                { text: report.articles[i].exchange.toString(), style: 'tblContentCenter' },
                                '',
                                ''
                            ],

                            [
                                { text: 'Avhämtat', style: 'sigContent', colSpan: 3 },
                                {},
                                {},
                                { text: 'Idnr.', style: 'sigContent' },
                                { text: 'Antal', style: 'sigContent' },
                                { text: 'KG', style: 'sigContent' }
                            ],

                            [
                                { text: '', style: 'signSheet', colSpan: 3 },
                                '',
                                '',
                                { text: '', style: 'signSheet' },
                                { text: '', style: 'signSheet' },
                                { text: '', style: 'signSheet' }
                            ]
                        ]
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return (i === 5 || i === 1 || i === 3) ? 0 : 1;
                        },
                        vLineWidth: function (i, node) {
                            return 1;
                        },
                        hLineColor: function (i, node) {
                            return 'grey';
                        },
                        vLineColor: function (i, node) {
                            return 'grey';
                        },
                    }
                });
            }
            return table;
        }

        function createInfoTable(differentReciever) {
            let table = [];

            if (differentReciever === true) {
                table.push({
                    table: {
                        widths: ['50%', '13%', '37%'],
                        body: [
                            [
                                { text: 'Info', style: 'tblLabel' },
                                { text: 'Transportör', style: 'titleInfo', margin: [0, 0], fontSize: 9 },
                                { text: '', style: '' }
                            ],
                            [
                                { text: report.info, style: 'infoContent', rowSpan: 4 },
                                { text: 'Företagsnamn:', style: 'contentInfoLabel' },
                                { text: report.reciever.name, style: 'contentInfoValue' }
                            ],
                            [
                                { text: ' ', style: '' },
                                { text: 'Adress:', style: 'contentInfoLabel' },
                                { text: report.reciever.adress, style: 'contentInfoValue' },
                            ],
                            [
                                { text: ' ', style: '' },
                                { text: 'Postort:', style: 'contentInfoLabel' },
                                { text: report.reciever.city, style: 'contentInfoValue' },
                            ],
                            [
                                { text: ' ', style: '' },
                                { text: 'Org.nr', style: 'contentInfoLabel' },
                                { text: report.reciever.corporateIdentity, style: 'contentInfoValue' },
                            ]
                        ]
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return 1;
                        },
                        vLineWidth: function (i, node) {
                            return (i === 2) ? 0 : 1;
                        },
                        hLineColor: function (i, node) {
                            return (i === 1 || i === 2 || i === 3 || i === 4) ? 'white' : 'gray';
                        },
                        vLineColor: function (i, node) {
                            return 'gray';
                        },

                    }
                });
            } else {
                table.push({
                    table: {
                        widths: '*',
                        body: [
                            [
                                { text: 'Info', style: 'tblLabel' },
                            ],
                            [
                                { text: report.info, style: 'infoContent' },
                            ]
                        ]
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return 1;
                        },
                        vLineWidth: function (i, node) {
                            return 1;
                        },
                        hLineColor: function (i, node) {
                            return (i === 1 || i === 3 || i === node.table.body.length && i === 7) ? 'white' : 'grey';
                        },
                        vLineColor: function (i, node) {
                            return 'grey';
                        },

                    }
                });
            }
            return table;
        }

        function transporterOrReciever(differentReciever) {
            let table = [];

            if (differentReciever === true) {
                table.push({
                    margin: [0, 2],
                    table: {
                        widths: '*',
                        body: [
                            [
                                { text: 'Avsändare', style: 'titleInfo' },
                                { text: 'Transportör', style: 'titleInfo' }
                            ],
                        ]
                    },
                    layout: 'noBorders'
                });
            } else {
                table.push({
                    margin: [0, 2],
                    table: {
                        widths: '*',
                        body: [
                            [
                                { text: 'Avsändare', style: 'titleInfo' },
                                { text: 'Mottagare', style: 'titleInfo' }
                            ],
                        ]
                    },
                    layout: 'noBorders'
                });
            }
            return table;
        }

        let orderedDate = new Date(report.orderedDate.toString());
        let formatedOrderedDate = orderedDate.toLocaleDateString();
        let dd = {
            pageSize: 'A4',
            header: function () {
                return {
                    style: 'topHeader',
                    table: {
                        widths: ['auto', 'auto', '50%', '*'],
                        body: [
                            [
	                            { image: imageInBytes, width: 54, height: 26, rowSpan:2 },
                                { text: 'Best.datum', style: 'dateHeader' },
                                { text: 'TRANSPORTDOKUMENT', style: 'titleHeader', rowSpan: 2 },
                                { text: 'Löpnummer', style: 'lopHeader' }
                            ],
                            [
                                '',
                                { text: formatedOrderedDate, style: 'dateValue' },
                                '',
                                { text: report.id.toString(), style: 'lopValue' }
                            ]
                        ]
                    },
                    layout: 'noBorders'
                };
            },
            footer: function (pagenumber, pagecount) {
                return {
                    style: 'footer',
                    text: pagenumber + ' / ' + pagecount
                };
            },
            content: [
                transporterOrReciever(this.isDifferentReciever(report)),
                {
                    style: 'customerHeader',
                    table: {
                        widths: ['10%', '40%', '13%', '38%'],
                        body: [
                            [
                                { text: 'Kundnr:', style: 'contentInfoLabel' },
                                { text: report.customer.custNumber, style: 'contentInfoValue' },
                                { text: 'Företagsnamn:', style: 'contentInfoLabel' },
                                { text: report.transporter.name, style: 'contentInfoValue' }
                            ],
                            [
                                { text: 'Kundnamn:', style: 'contentInfoLabel' },
                                { text: report.customer.name, style: 'contentInfoValue' },
                                { text: 'Adress:', style: 'contentInfoLabel' },
                                { text: report.transporter.adress, style: 'contentInfoValue' }
                            ],
                            [
                                { text: 'Adress:', style: 'contentInfoLabel' },
                                { text: report.customer.adress, style: 'contentInfoValue' },
                                { text: 'Postort:', style: 'contentInfoLabel' },
                                { text: report.transporter.city, style: 'contentInfoValue' }
                            ],
                            [
                                { text: 'Postort:', style: 'contentInfoLabel' },
                                { text: report.customer.city, style: 'contentInfoValue' },
                                { text: 'Org.nr:', style: 'contentInfoLabel' },
                                { text: report.transporter.corporateIdentity, style: 'contentInfoValue' }
                            ],
                            [
                                { text: 'Org.nr:', style: 'contentInfoLabel' },
                                { text: report.customer.corporateIdentity, style: 'contentInfoValue' },
                                '',
                                ''
                            ],
                            [
                                { text: 'Tel.nr:', style: 'contentInfoLabel' },
                                { text: report.customer.tel, style: 'contentInfoValue' },
                                '',
                                ''
                            ],
                        ]
                    },
                    layout: 'noBorders'
                },
                createInfoTable(this.isDifferentReciever(report)),
                createArtTable(reportArticles),
                {
                    id: 'signature',
                    style: 'sigTable',
                    table: {
                        widths: ['50%', '20%', '30%'],
                        body: [
                            [
                                {
                                    text: 'Avsändare\n\n\n' +
                                    '___________________________________________________', rowSpan: 2, style: 'sigContentSignSheet'
                                },
                                { text: '' },
                                { text: 'Extra tid', style: 'sigContentSignSheet' },
                            ],
                            [
                                { text: '' },
                                { text: '' },
                                { text: 'Datum', style: 'sigContentSignSheet' },
                            ]
                        ]
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return (i === 0 || i === node.table.body.length) ? 0 : 1;
                        },
                        vLineWidth: function (i, node) {
                            return 1;
                        },
                        hLineColor: function (i, node) {
                            return 'white';
                        },
                        vLineColor: function (i, node) {
                            return 'white';
                        },

                    }
                },
            ],
            pageBreakBefore: function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
                if (currentNode.id === 'tbl4' && currentNode.pageNumbers.length != 1) { return true; }
                else if (currentNode.id === 'tbl5' && currentNode.pageNumbers.length != 1) { return true; }
                else if (currentNode.id === 'tbl10' && currentNode.pageNumbers.length != 2) { return true; }
                else if (currentNode.id === 'tbl16' && currentNode.pageNumbers.length != 2) { return true; }
                else if (currentNode.id === 'tbl22' && currentNode.pageNumbers.length != 2) { return true; }
                else if (currentNode.id === 'tbl28' && currentNode.pageNumbers.length != 2) { return true; }
                else if (currentNode.id === 'signature' && currentNode.pageNumbers.length != 1) { return true; }
                else { return false; }
            },
            styles: {
                // Header
                topHeader: {
                    margin: [40, 10],
                    alignment: 'center',
                    fontSize: 9
                },
                titleHeader: {
                    fontSize: 16
                },
                dateHeader: {
                    alignment: 'left'
                },
                dateValue: {
                    bold: true,
                    alignment: 'left'
                },
                lopHeader: {
                    alignment: 'right'
                },
                lopValue: {
                    bold: true,
                    alignment: 'right'
                },
                // Header END
                customerHeader: {

                },
                signSheet: {
                    margin: 10,
                    fontSize: 8,
                    fillColor: '#DCDCDC'
                },
                titleInfo: {
                    bold: true,
                    decoration: 'underline',
                    margin: [0, 8]
                },
                contentInfoLabel: {
                    fontSize: 10,
                    bold: true
                },
                contentInfoValue: {
                    fontSize: 9,
                },
                restInfo: {
                    margin: [0, 10]
                },
                infoContent: {
                    fontSize: 9
                },
                artTable: {
                    margin: [0, 5, 0, 15]
                },
                tblLabel: {
                    fontSize: 7
                },
                tblContent: {
                    fontSize: 8
                },
                tblRemoveBorder: {
                    fontSize: 8,
                    border: 0,
                },
                sigTable: {
                    margin: [0, 8]
                },
                footer: {
                    margin: [10, 15]
                },
                tblLabelCenter: {
                    fontSize: 7,
                    alignment: 'center'
                },
                tblContentCenter: {
                    fontSize: 8,
                    alignment: 'center'
                },
                sigTitle: {
                    fillColor: '#DCDCDC'
                },
                sigTitleTR: {
                    fontSize: 7
                },
                sigContent: {
                    fontSize: 8,
                    fillColor: '#DCDCDC'
                },
                sigContentSign: {
                    fontSize: 11,
                    fillColor: '#DCDCDC',
                },
                sigContentSignSheet: {
                    fontSize: 10,
                    fillColor: '#DCDCDC',
                    margin: [0, 0, 0, 10]
                },
            }
        };
        pdfMake.createPdf(dd).open();
    }

   

    isDifferentReciever(report: IReport) {
        if (report.reciever.name !== 'Customer Miljöhantering AB') {
            return true;
        } else {
            return false;
        }
    }
};
// pdfMake.createPdf(dd).download();
// pdfMake.createPdf(dd).open();
        // pdfMake.createPdf(dd).print();
