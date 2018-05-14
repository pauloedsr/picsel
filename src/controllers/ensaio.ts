import { seleciona } from "./foto";
import { default as Ensaio, EnsaioModel } from "../models/Ensaio";
import { default as Foto, FotoModel } from "../models/Foto";
import { Request, Response, NextFunction } from "express";


export let create = (req: Request, res: Response, next: NextFunction) => {
  req.assert("nome", "Nome é necessário").notEmpty();
  req.assert("chave", "Chave é necessário").notEmpty();
  const errors = req.validationErrors();

  if (errors) {
    return res.json({success: false, errors : errors});
  }

  const model = new Ensaio(req.body);
  model.save((err) => {
    if (err) { return next(err); }
    res.json({success: true, obj: model});
  });
};

/**
 * Lista as timelines de acordo com autor
 */
export let list = (req: Request, res: Response, next: NextFunction) => {
  Ensaio.find({}, (err, ensaios) => {
    if (err) { return next(err); }
    if (ensaios)
      return res.json(ensaios);
    else
      return res.json({success: false});
  });
};

export let view = (req: Request, res: Response, next: NextFunction) => {
  req.assert("page", "Page é necessário").notEmpty();
  req.assert("chave", "Chave é necessário").notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    return res.json({success: false, errors : errors});
  }

  const chave = req.params.chave;
  const pagina = Number(req.params.page);
  let totalSel: number = 0;
  let totalFotos: number = 0;
  // let ensaio: EnsaioModel;
  // let fotos: FotoModel[];
  console.log("pagina", pagina);
  Ensaio.findOne({chave: chave}).exec((err, ensaio) => {
      if (err) console.log("Erro", err);

      Foto.count({ensaio: ensaio._id}).exec((err, res) => {
        totalFotos = res;
      });
      Foto.count({ensaio: ensaio._id, selecionado: true}).exec((err, res) => {
        totalSel = res;
      });

      Foto.find({ensaio: ensaio._id}).skip(15 * (pagina - 1)).limit(15).exec((err, fotos) => {
        return res.json({ensaio: ensaio, fotos: fotos, totalSel: totalSel, totalFotos: totalFotos});
      });
  });
};

/**
 * Remove
 */
export let remove = (req: Request, res: Response, next: NextFunction) => {
  req.assert("id", "ID é necessário").notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    return res.json({success: false, errors : errors});
  }

  Foto.remove({ensaio : req.params.id}, (err) => {
    if (err) return next(err);
  }).then(() => {
    Ensaio.findByIdAndRemove(req.params.id).then(() => {
      return res.json({success: true});
    });
  });
};