/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.association;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperation;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.LabelSuffix;
import com.eclipsesource.uml.glsp.uml.handler.operations.directediting.BaseLabelEditHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.association.UpdateAssociationEndNameContribution;

public final class SetAssociationEndNameHandler extends BaseLabelEditHandler<Property> {

   public SetAssociationEndNameHandler() {
      super(CoreTypes.LABEL_EDGE_NAME, LabelSuffix.SUFFIX);
   }

   @Override
   protected CCommand createCommand(final ApplyLabelEditOperation operation, final Property element) {
      return UpdateAssociationEndNameContribution.create(element, operation.getText());
   }

}
