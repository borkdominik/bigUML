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
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.core.gmodel.suffix.LabelSuffixAppender;
import com.eclipsesource.uml.glsp.core.utils.UmlConfig;
import com.eclipsesource.uml.glsp.uml.handler.operations.directediting.BaseLabelEditHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.association.SetAssociationEndNameContribution;

public class SetAssociationEndNameHandler extends BaseLabelEditHandler<Property> {

   public SetAssociationEndNameHandler() {
      super(UmlConfig.Types.LABEL_EDGE_NAME, LabelSuffixAppender.SUFFIX);
   }

   @Override
   protected CCommand command(final Property element, final String newText) {
      return SetAssociationEndNameContribution.create(element, newText);
   }

}
