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

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.PropertyLabelMultiplicitySuffix;
import com.eclipsesource.uml.glsp.uml.handler.operations.directediting.BaseLabelEditHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.association.SetAssociationEndMultiplicityContribution;

public class SetAssociationEndMultiplicityHandler extends BaseLabelEditHandler<Property> {

   public SetAssociationEndMultiplicityHandler() {
      super(ClassTypes.LABEL_EDGE_MULTIPLICITY, PropertyLabelMultiplicitySuffix.SUFFIX);
   }

   @Override
   protected CCommand command(final Property element, final String newText) {
      var newBounds = getBoundsFromInput(newText);
      return SetAssociationEndMultiplicityContribution.create(element, newBounds);
   }

   private String multiplicityRegex() {
      return "\\[(.*?)\\]";
   }

   private String getBoundsFromInput(final String inputText) {
      String bounds = "";
      Pattern pattern = Pattern.compile(multiplicityRegex());
      Matcher matcher = pattern.matcher(inputText);
      if (matcher.find()) {
         bounds = matcher.group(1);
      }
      return bounds.trim();
   }
}
