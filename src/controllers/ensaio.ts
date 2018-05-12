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
  req.assert("id", "ID é necessário").notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    return res.json({success: false, errors : errors});
  }

  const id = req.params.id;
  let ensaio: EnsaioModel;
  let fotos: FotoModel[];
  Ensaio.findById(id, (err, data) => {
    if (err) { return next(err); }
    if (data)
      ensaio = data;
    else
      return res.json({success: false});
  }).then(() => {
    Foto.find({ensaio: id}, (err, data) => {
      fotos = data;
    }).sort({createdAt : -1}).then(() => {
      return res.json({ensaio: ensaio, fotos: fotos});
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