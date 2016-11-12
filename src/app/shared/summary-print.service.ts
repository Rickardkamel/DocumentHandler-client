import { Injectable } from '@angular/core';
import { IReport } from './report.interface';
import { IArticle } from './article.interface';
declare var pdfMake: any;

@Injectable()
export class SummaryPrintService {
    pdf: any;
    allReportArticles: IArticle[] = [];
    allReports: IReport[] = [];
    holdArticles: IArticle[] = [];

    buildPdf(reports) {
        this.allReports = reports;
        this.allReportArticles = [];

        for (let i = 0; i < reports.length; i++) {
            for (let c = 0; c < reports[i].articles.length; c++) {
                this.allReportArticles.push(reports[i].articles[c]);
            }
        }

        function sumAllTheDuplicates(data) {
            for (let i = 0; i < data.length; ++i) {
                for (let j = i + 1; j < data.length; ++j) {
                    if (data[i].waste.id === data[j].waste.id && data[i].vessel.type === data[j].vessel.type){
                        data[i].exchange += data[j].exchange;
                        data.splice(j--, 1);
                    }
                }
            }
            return data;
        }

        function createSummaryTable(value) {
            let data = sumAllTheDuplicates(value);
            let table = [];
            for (let i = 0; i < data.length; i++) {

                table.push({
                    style: 'artTable' + i,
                    fillColor: (i % 2) ? 'white' : '#DCDCDC',
                    id: 'tbl' + i,
                    table: {
                        widths: ['*', '*', '*', '*'],
                        body: [
                            [
                                { text: 'Art nr.', style: 'tblLabel' },
                                { text: 'Avfallsnamn', style: 'tblLabel' },
                                { text: 'Kärl', style: 'tblLabel' },
                                { text: 'Antal', style: 'tblLabel' }
                            ],
                            [
                                { text: data[i].waste.id, style: 'tblContent' },
                                { text: data[i].waste.text, style: 'tblContent' },
                                { text: data[i].vessel.type, style: 'tblContent' },
                                { text: data[i].exchange.toString(), style: 'tblContent' }
                            ]
                        ]
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return (i === 0 || i === node.table.body.length) ? 1 : 0;
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

        function createLopNrTable(report) {
            let foo = [];
            let txt = '';

            for (let i = 0; i < report.length; i++) {
                txt += report[i].id + ', ';
            }

            foo.push(
                { text: txt, style: '' }
            );

            return foo;
        }

        function todaysDate() {

            let d = new Date();
            let day = d.getDate();
            let monthIndex = d.getMonth() + 1;
            let year = d.getFullYear();

            return day + '/' + monthIndex + '-' + year;

        }


        let layout =  {
            pageSize: 'A4',
            header: function () {
                return {
                    style: 'topHeader',
                    table: {
                        widths: ['auto', 'auto', '50%', '*'],
                        body: [
                            [
                                { image: 'sampleImage.jpg', width: 55, rowSpan: 2 },
                                { text: 'Körrutt: ' + reports[0].region.name, style: 'regionHeader' },
                                { text: 'PLOCKLISTA', style: 'titleHeader', rowSpan: 2 },
                                { text: 'Datum', style: 'dateHeader' }
                            ],
                            [
                                '',
                                '',
                                '',
                                { text: todaysDate(), style: 'dateValue' }
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
                createSummaryTable(this.allReportArticles),
                { text: 'Löp nr:', decoration: 'underline', margin: [0, 10] },
                createLopNrTable(this.allReports)
            ],
            pageBreakBefore: function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
                if (currentNode.id === 'tbl21' && currentNode.pageNumbers.length != 2) { return true; }
                else if (currentNode.id === 'tbl36' && currentNode.pageNumbers.length != 2) { return true; }
                else if (currentNode.id === 'tbl51' && currentNode.pageNumbers.length != 2) { return true; }
                else { return false; }
            },
            styles: {
                // Header
                topHeader: {
                    margin: [40, 10],
                    alignment: 'center',
                    fontSize: 9
                },
                regionHeader: {
                    alignment: 'left'
                },
                dateHeader: {
                    alignment: 'right'
                },
                dateValue: {
                    bold: true,
                    alignment: 'right'
                },
                titleHeader: {
                    fontSize: 16
                },
                // Header END
                footer: {
                    margin: [10, 15]
                },
                artTable0: {
                    margin: [0, 20, 0, 0]
                },
                artTable21: {
                    margin: [0, 20, 0, 0]
                },
                artTable36: {
                    margin: [0, 20, 0, 0]
                },
                artTable51: {
                    margin: [0, 20, 0, 0]
                },
                tblLabel: {
                    fontSize: 7,
                    decoration: 'underline'
                },
                tblContent: {
                    fontSize: 10
                },
            }
        };
        pdfMake.createPdf(layout).download(reports[0].region.name + ' - ' + todaysDate());
    }
}
