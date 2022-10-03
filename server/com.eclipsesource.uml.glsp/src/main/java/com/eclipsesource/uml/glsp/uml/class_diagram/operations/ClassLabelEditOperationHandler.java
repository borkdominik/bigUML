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
package com.eclipsesource.uml.glsp.uml.class_diagram.operations;

public class ClassLabelEditOperationHandler {
   /*-
   
   
   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }
   
   @Override
   public void executeOperation(final ApplyLabelEditOperation editLabelOperation,
      final ClassModelServerAccess modelAccess) {
      UmlModelState modelState = getUmlModelState();
      UmlModelIndex modelIndex = modelState.getIndex();
   
      String inputText = editLabelOperation.getText().trim();
      String graphicalElementId = editLabelOperation.getLabelId();
   
      GModelElement label = getOrThrow(modelIndex.findElementByClass(graphicalElementId, GModelElement.class),
         GModelElement.class, "Element not found.");
   
      switch (label.getType()) {
         case Types.LABEL_NAME:
            String containerElementId = UmlIDUtil.getElementIdFromHeaderLabel(graphicalElementId);
            Element semanticElement = getOrThrow(modelIndex.getEObject(containerElementId),
               Element.class, "No valid container with id " + graphicalElementId + " found");
   
            if (semanticElement instanceof Constraint) {
               modelAccess.setConditionBody(modelState, (Constraint) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not change Property to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof Class) {
               modelAccess.setClassName(modelState, (Class) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not rename Class to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof Interface) {
               modelAccess.setInterfaceName(modelState, (Interface) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not rename Interface to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof Enumeration) {
               modelAccess.setEnumerationName(modelState, (Enumeration) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not rename Enumeration to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof NamedElement) {
               modelAccess.renameElement(modelState, (NamedElement) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not change Property to: " + inputText);
                     }
                  });
            }
            break;
   
         case ClassTypes.LABEL_PROPERTY_NAME:
            containerElementId = PropertyIdUtil.getElementIdFromPropertyLabelName(graphicalElementId);
            Property property = getOrThrow(modelIndex.getEObject(containerElementId),
               Property.class, "No valid container with id " + graphicalElementId + " found");
   
            modelAccess.setPropertyName(modelState, property, inputText)
               .thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException("Could not change Property type to: " + inputText);
                  }
               });
   
            break;
   
         case ClassTypes.LABEL_PROPERTY_TYPE:
            containerElementId = PropertyIdUtil.getElementIdFromPropertyLabelType(graphicalElementId);
            property = getOrThrow(modelIndex.getEObject(containerElementId),
               Property.class, "No valid container with id " + graphicalElementId + " found");
   
            modelAccess.setPropertyType(modelState, property, inputText)
               .thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException("Could not change Property type to: " + inputText);
                  }
               });
   
            break;
   
         case ClassTypes.LABEL_PROPERTY_MULTIPLICITY:
            containerElementId = PropertyIdUtil.getElementIdFromPropertyLabelMultiplicity(graphicalElementId);
            property = getOrThrow(modelIndex.getEObject(containerElementId),
               Property.class, "No valid container with id " + graphicalElementId + " found");
   
            modelAccess.setPropertyBounds(modelState, property, inputText)
               .thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException("Could not change Property bounds to: " + inputText);
                  }
               });
   
            break;
   
         case ClassTypes.ATTRIBUTE:
            Property objectAttribute = getOrThrow(modelIndex.getEObject(graphicalElementId),
               Property.class, "No valid container with id " + graphicalElementId + " found");
   
            String attributeName = getNameFromInput(inputText);
            String attributeType = getTypeFromInput(inputText);
            String attributeBounds = getBoundsFromInput(inputText);
   
            modelAccess.setAttribute(modelState, objectAttribute, attributeName, attributeType, attributeBounds)
               .thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException("Could not change Attribute to: " + inputText);
                  }
               });
   
            break;
   
         case Types.LABEL_EDGE_NAME:
            containerElementId = UmlIDUtil.getElementIdFromLabelName(graphicalElementId);
            Property associationEnd = getOrThrow(modelIndex.getEObject(containerElementId),
               Property.class, "No valid container with id " + graphicalElementId + " found");
   
            modelAccess.setAssociationEndName(modelState, associationEnd, inputText)
               .thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException("Could not change Association End Name to: " + inputText);
                  }
               });
            break;
   
         case ClassTypes.LABEL_EDGE_MULTIPLICITY:
            containerElementId = EdgeMultiplicityIdUtil.getElementIdFromEdgeLabelMultiplicity(graphicalElementId);
            associationEnd = getOrThrow(modelIndex.getEObject(containerElementId),
               Property.class, "No valid container with id " + graphicalElementId + " found");
   
            modelAccess.setAssociationEndMultiplicity(modelState, associationEnd, getBoundsFromInput(inputText))
               .thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException("Could not change Association End Name to: " + inputText);
                  }
               });
            break;
      }
   
   }
   
   @Override
   public String getLabel() { return "Apply label"; }
   
   private String typeRegex() {
      return "\\:";
   }
   
   private String multiplicityRegex() {
      return "\\[(.*?)\\]";
   }
   
   private String getNameFromInput(final String inputText) {
      String name = inputText;
      Pattern pattern = Pattern.compile(typeRegex());
      Matcher matcher = pattern.matcher(inputText);
      if (matcher.find()) {
         name = inputText.split(typeRegex())[0];
      }
      return name.replaceAll(multiplicityRegex(), "").trim();
   }
   
   private String getTypeFromInput(final String inputText) {
      String type = "";
      Pattern pattern = Pattern.compile(typeRegex());
      Matcher matcher = pattern.matcher(inputText);
      if (matcher.find()) {
         type = inputText.split(typeRegex())[1];
      }
      return type.replaceAll(multiplicityRegex(), "").trim();
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
   */
}
