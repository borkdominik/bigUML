/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.commands.usecasediagram.association;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.*;
import org.eclipse.uml2.uml.Class;

public class AddUseCaseAssociationCommand extends UmlSemanticElementCommand {

   private final Association newAssociation;
   protected final Classifier sourceActor;
   protected final Classifier targetUseCase;

   public AddUseCaseAssociationCommand(final EditingDomain domain, final URI modelUri,
                                       final String sourceClassUriFragment, final String targetClassUriFragment) {
      super(domain, modelUri);
      this.newAssociation = UMLFactory.eINSTANCE.createAssociation();
      this.sourceActor = UmlSemanticCommandUtil.getElement(umlModel, sourceClassUriFragment, Classifier.class);
      this.targetUseCase = UmlSemanticCommandUtil.getElement(umlModel, targetClassUriFragment, Classifier.class);
   }

   @Override
   protected void doExecute() {
      getNewAssociation().createOwnedEnd(UmlSemanticCommandUtil.getNewActorName(umlModel), sourceActor);
      getNewAssociation().createOwnedEnd(UmlSemanticCommandUtil.getNewUseCaseName(umlModel), targetUseCase);
      umlModel.getPackagedElements().add(getNewAssociation());
   }

   public Association getNewAssociation() { return newAssociation; }

}
